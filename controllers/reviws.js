const Review = require('../models/review');
const Match = require('../models/Match');

module.exports.createReview = async (req, res) => {
    const matches = await Match.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    matches.review.push(review);
    await review.save();
    await matches.save();
    req.flash('success', 'Successfully created new review'); // Added flash message
    res.redirect(`/Matches/${matches._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Match.findByIdAndUpdate(id, { $pull: { review: reviewId } }); // NOTE: Corrected model path to 'review'
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review'); // Added flash message
    res.redirect(`/Matches/${id}`);
};