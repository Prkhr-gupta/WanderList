const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


//Joi Check review
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Review Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {review} = req.body;
    let newReview = new Review(review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "review added");
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete("/:reviewid", wrapAsync(async(req, res) => {
    let {id, reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;