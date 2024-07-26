const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, validateReview, isAuthor } = require("../middlewares.js");

//Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {review} = req.body;
    let newReview = new Review(review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "review added");
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete("/:reviewid", isLoggedIn, isAuthor, wrapAsync(async(req, res) => {
    let {id, reviewid} = req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
    req.flash("success", "review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;