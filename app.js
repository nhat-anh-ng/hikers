const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ErrorExpress = require("./utils/ExpressError");
const methodOverride = require("method-override"); //to fake a request
const HikingPlace = require("./models/hikers");
const Review = require("./models/review");

const hikingPlaces = require("./routes/hikingPlaces");

mongoose.connect("mongodb://localhost:27017/hikers", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate); //
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // tell express to parse the body
app.use(methodOverride("_method")); //query string used in edit.ejs

const validateReview = (req, res, next) => {
  //create middleware
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message);
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/hiking-places", hikingPlaces);

app.get("/", (req, res) => {
  res.render("home");
});

app.post(
  "/hiking-places/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const hikingPlace = await HikingPlace.findById(req.params.id);
    const review = new Review(req.body.review);
    hikingPlace.reviews.push(review); // from hikers.js
    await review.save();
    await hikingPlace.save();
    res.redirect(`/hiking-places/${hikingPlace._id}`);
  })
);

app.delete(
  "/hiking-places/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await HikingPlace.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/hiking-places/${id}`);
  })
);

app.listen(3000, () => {
  console.log("port 3000 serving");
});
