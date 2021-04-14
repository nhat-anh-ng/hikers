const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/hiking-places", async (req, res) => {
  const hikingPlaces = await HikingPlace.find({});
  res.render("hiking-places/index", { hikingPlaces }); //pass to template
});

app.get("/hiking-places/:id", async (req, res) => {
  const hikingPlace = await HikingPlace.findById(req.params.id);
  res.render("hiking-places/show", { hikingPlace }); //take id and look up corresponding place
}); //id to look up corresponding hiking place from data

app.listen(3000, () => {
  console.log("port 3000 serving");
});
