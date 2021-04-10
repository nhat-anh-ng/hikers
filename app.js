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
app.get("/add-hiking-place", async (req, res) => {
  const hike = new HikingPlace({ title: "My Garden", location: "Paris" });
  await hike.save();
  res.send(hike);
});

app.listen(5000, () => {
  console.log("port 3000 serving");
});
