const { MatchSchema } = require('./schemas.js');
const ExpressError=require('./utilities/ExpressError');
const Match = require('./models/Match');
const review = require('./models/review.js');
 module.exports.isLoggedIN=(req,res,next)=>{
    console.log(req.user);
    if (!req.isAuthenticated()) {
    return res.redirect('/login?error=You must be logged in to view that page');
}
next();
}

 module.exports.validateMatch = (req, res, next) => {
    const { error } = MatchSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor=async (req,res,next)=>{
    const { id } = req.params;
    const mat = await Match.findById(id);
    if (!mat.author.equals(req.user._id)) {
        return res.redirect(`/matches/${mat._id}?error=You are not authorized to edit this match`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const rev = await review.findById(reviewId);

    if (!rev) {
        return res.redirect(`/matches/${id}`);
    }

    if (!rev.author.equals(req.user._id)) {
        return res.redirect(`/matches/${id}`);
    }

    next();
};