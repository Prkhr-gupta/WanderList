const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js"); 
const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = 8080;

main()
    .then( () => {
        console.log("Connection Successful!");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderList');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
    secret: "MySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 2*24*60*60*1000,
        maxAge: 2*24*60*60*1000,
        httpOnly: true
    }
};

//Root
app.get("/", (req, res) => {
    res.send("Root Working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Page not found
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

//Error Handler
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(port, () => {
    console.log("App is Listening on port 8080");
});