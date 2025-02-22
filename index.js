if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const imagesUrl = require("./imagesUrl.js");
const paypal = require("./services/paypal.js");

const app = express();
const port = 8080;

let localDbUrl = "mongodb://localhost:27017/WanderList";
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connection Successful!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 2 * 24 * 60 * 60 * 1000,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/", async (req, res) => {
  res.render("main.ejs", { imagesUrl });
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.post(
  "/pay",
  wrapAsync(async (req, res) => {
    let { price, desc } = req.body;
    const url = await paypal.createOrder(price, desc);
    res.redirect(url);
  })
);

app.get(
  "/complete-order",
  wrapAsync(async (req, res) => {
    await paypal.capturePayment(req.query.token);
    req.flash("success", "Booking Succesful!");
    res.redirect("/listings");
  })
);

app.get("/cancel-order", (req, res) => {
  req.flash("error", "Booking Cancelled!");
  res.redirect("/listings");
});

//Page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log("App is Listening on port 8080");
});
