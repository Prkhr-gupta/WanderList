const User = require("../models/user.js");

//Signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

//register new user
module.exports.signup = async (req, res) => {
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
};

//login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//login
module.exports.login = async (req, res) => {
    req.flash("success", "Login successful!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
    req.logOut( (err) =>{
        if(err) return next(err);
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
};
