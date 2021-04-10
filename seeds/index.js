const mongoose = require("mongoose");
const HikingPlace = require("../models/hikers");

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

const seedDB = async () => {
  await HikingPlace.deleteMany({});
  const c = new HikingPlace({ title: "new" });
  await c.save();
};

seedDB();
