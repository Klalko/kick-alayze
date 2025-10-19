const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIN } = require('../middleware');
const { validateMatch } = require('../middleware');
const { isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// We keep the service import here, but the controller must also import it
// if it is not passed as an argument.
const { getTodayRelevantMatches } = require('../src/sportsdbService');

const matches = require('../controllers/matchs');

// ----------------------------------------------------
// EXISTING ROUTES FOR USER-CREATED (MONGOOSE) MATCHES
// ----------------------------------------------------

// GET /matches (Index page for user-created matches) - This route now handles ALL data.
router.get('/', catchAsync(matches.index));

router.get('/new', isLoggedIN, matches.renderNewForm);

router.post('/new',
    isLoggedIN,
    upload.array('image', 5),
    validateMatch,
    catchAsync(matches.createMatch)
);

router.get('/:id/edit', isLoggedIN, isAuthor, catchAsync(matches.renderEditForm));

router.put('/:id', isLoggedIN, isAuthor, upload.array('image', 5), validateMatch, catchAsync(matches.updateMatch));

router.delete('/:id', isLoggedIN, isAuthor, catchAsync(matches.deleteMatch));

router.get('/:id', catchAsync(matches.showMatch));


module.exports = router;
