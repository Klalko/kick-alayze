if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({quiet: true} );
}
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;





const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const ExpressError = require('./utilities/ExpressError');
const sanitizeV5 = require('./utilities/mongoSanitizeV5.js');
const helmet=require('helmet');



const matchRoutes = require('./routes/Matches');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

mongoose.connect('mongodb://localhost:27017/kick-alyze');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Database connected'));

const app = express();
app.set('query parser', 'extended');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());




const sessionConfig = {
    name:'OmarAlsaudi',
    secret: 'thisshouldbebetter',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 30
    }
};
app.use(session(sessionConfig));
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/", // Still commented out
    // "https://api.mapbox.com/",       // Still commented out
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",        // Still commented out
    // "https://api.tiles.mapbox.com/",  // Still commented out
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/",
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",         // Still commented out
    // "https://a.tiles.mapbox.com/",     // Still commented out
    // "https://b.tiles.mapbox.com/",     // Still commented out
    // "https://events.mapbox.com/",      // Still commented out
    "https://api.maptiler.com/",
];

// 🛠️ FIX APPLIED HERE: Added fonts.gstatic.com for Google Fonts
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
];

app.use(helmet.contentSecurityPolicy({
    directives: {
        // NOTE: The spread syntax '...' is correct for Helmet v4+ or the 'contentSecurityPolicy' helper
        defaultSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dl93vkrbh/",
            "https://images.unsplash.com/",
            "https://api.maptiler.com/"
        ],
        // The spread ensures "https://fonts.gstatic.com/" is included
        fontSrc: ["'self'", ...fontSrcUrls],
    },
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/Matches', matchRoutes);



app.use('/Matches/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

module.exports = app;










app.use((req, res, next) => {
    const err = new Error('Page not found!');
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no something went wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
