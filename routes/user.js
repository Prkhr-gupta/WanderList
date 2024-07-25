const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");

//Signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

//register new user
router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        req.logIn(registeredUser, (err) =>{
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlist");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

//login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

//login
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), wrapAsync(async (req, res) => {
    req.flash("success", "Login successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}));

// logout
router.get("/logout", (req, res, next) => {
    req.logOut( (err) =>{
        if(err) return next(err);
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
});

module.exports = router;