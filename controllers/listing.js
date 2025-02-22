const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.home = async (req, res) => {
    let allListings = await Listing.find({});
    let filter = "all1";
    res.render("listings/home.ejs", {allListings, filter});
}

//New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

//Filter Route
module.exports.filterListings = async (req, res) => {
    let {filter} = req.params;
    let allListings = await Listing.find({category: `${filter}`});
    res.render("listings/home.ejs", {allListings, filter});
}

//Search Route
module.exports.searchListings = async (req, res) => {
    let {destination} = req.body;
    let city = await Listing.find({loc: `${destination}`});
    let country = await Listing.find({country: `${destination}`});
    let all = [...city, ...country];
    let allListings = [];
    let titles = [];
    for(let listing of all){
        let title = listing.title;
        if(!titles.includes(title)){
            console.log(title);
            titles.push(title);
            allListings.push(listing);
        }
    }
    if(allListings.length == 0){
        req.flash("error", "No Listings found!");
        return res.redirect("/listings");
    }
    let filter = "all1";
    res.render("listings/home.ejs", {allListings, filter});
}

//Show Route
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing does not exist!");
        res.redirect("/listings");
    }
    else
        res.render("listings/show.ejs", {listing});
}

//Create Route
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.loc,
        limit: 1
    })
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    req.flash("success", "New listing added!");
    res.redirect("/listings");
}

//Edit Route
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    let degradedImageUrl = listing.image.url.replace("/upload", "/upload/h_300/w_250"); 
    res.render("listings/edit.ejs", {listing, degradedImageUrl});
}

//Update Route
module.exports.updateListing = async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send Valid Data");
    }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.loc,
        limit: 1
    })
    .send()
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true});
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

//Destroy Route
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}