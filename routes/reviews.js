
const express = require('express');
const router = express.Router({ mergeParams: true }); 
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Review = require('../models/review');
const Match = require('../models/Match');
const { ReviewSchema } = require('../schemas.js');
const { isLoggedIN , isReviewAuthor }=require('../middleware');
const reviews = require('../controllers/reviws');



const validateReview = (req, res, next) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};








router.post('/', isLoggedIN, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIN, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;