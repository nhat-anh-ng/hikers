const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); //to fake a request
const HikingPlace = require("./models/hikers");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); // tell express to parse the body
app.use(methodOverride("_method")); //query string used in edit.ejs

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/hiking-places", async (req, res) => {
  const hikingPlaces = await HikingPlace.find({});
  res.render("hiking-places/index", { hikingPlaces }); //pass to template
});

app.get("/hiking-places/new", (req, res) => {
  res.render("hiking-places/new");
});

app.post("/hiking-places", async (req, res) => {
  const hikingPlace = new HikingPlace(req.body.hikingPlace);
  await hikingPlace.save();
  res.redirect(`/hiking-places/${hikingPlace._id}`);
});

app.get("/hiking-places/:id", async (req, res) => {
  const hikingPlace = await HikingPlace.findById(req.params.id);
  res.render("hiking-places/show", { hikingPlace }); //take id and look up corresponding place
}); //id to look up corresponding hiking place from data

app.get("/hiking-places/:id/edit", async (req, res) => {
  const hikingPlace = await HikingPlace.findById(req.params.id);
  res.render("hiking-places/edit", { hikingPlace });
});

app.put("/hiking-places/:id", async (req, res) => {
  const { id } = req.params;
  const hikingPlace = await HikingPlace.findByIdAndUpdate(id, {
    ...req.body.hikingPlace,
  }); //...take what's in body not hardcode data, spread to the object
  res.redirect(`/hiking-places/${hikingPlace._id}`);
});

app.delete("/hiking-places/:id", async (req, res) => {
  const { id } = req.params;
  await HikingPlace.findByIdAndDelete(id);
  res.redirect("/hiking-places");
});

app.listen(3000, () => {
  console.log("port 3000 serving");
});
