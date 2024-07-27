const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview, isAuthor } = require("../middlewares.js");
const reviewController = require("../controllers/review.js");

//Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewid", isLoggedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;