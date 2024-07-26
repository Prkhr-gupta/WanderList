const Listing = require("./models/listing.js");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

//isLoggedin
module.exports.isLoggedIn = (req, res, next) => {
    console.log("check");
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in!");
        return res.redirect("/login");
    }
    next();
};

//saveRedirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }    
    next();
};

//isOwner
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have access to this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//isAuthor
module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewid} = req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have access to this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

//Joi Check listing
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Joi Check review
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}