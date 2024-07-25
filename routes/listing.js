const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares.js");

//Joi Check listing
const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//Index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/home.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id",  wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    else
        res.render("listings/show.ejs", {listing});
}));

//Create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New listing added!");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    else
        res.render("listings/edit.ejs", {listing});
}));

//Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send Valid Data");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true});
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}));

//Destroy Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;