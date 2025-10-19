const mongoSanitize = require('express-mongo-sanitize');

// deep-clone helper
function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(deepCopy);
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, deepCopy(v)])
    );
}

// middleware
module.exports = function sanitizeV5(options = {}) {
    // Ensure that 'replaceWith' is definitively part of the options used by sanitize()
    const finalOptions = { replaceWith: '_', ...options };
    const hasOnSanitize = typeof finalOptions.onSanitize === 'function';

    return function (req, _res, next) {

        // still writable fields
        ['body', 'params', 'headers'].forEach(key => {
            if (req[key]) {
                const clean = mongoSanitize.sanitize(req[key], finalOptions);
                req[key] = clean;
                if (hasOnSanitize && mongoSanitize.has(clean, finalOptions.allowDots)) {
                    finalOptions.onSanitize({ req, key });
                }
            }
        });

        // updating handling of read-only req.query (getter in Express 5)
        if (req.query) {
            const originalQuery = deepCopy(req.query);

            // --- DEBUG LOG: INPUT ---
            console.log('DEBUG (Sanitizer Input): req.query before sanitization:', originalQuery);

            const cleanQuery = mongoSanitize.sanitize(originalQuery, finalOptions);

            // --- DEBUG LOG: OUTPUT ---
            console.log('DEBUG (Sanitizer Output): cleanQuery after sanitization:', cleanQuery);


            // replace the getter with a concrete, sanitized value
            Object.defineProperty(req, 'query', {
                value: cleanQuery,
                writable: false,
                configurable: true,
                enumerable: true
            });

            if (hasOnSanitize && mongoSanitize.has(cleanQuery, finalOptions.allowDots)) {
                finalOptions.onSanitize({ req, key: 'query' });
            }
        }

        next();
    };
};
