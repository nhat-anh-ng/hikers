const mongoose = require("mongoose");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await HikingPlace.deleteMany({});
  for (let i = 0; i < 3; i++) {
    //loop 50 places
    const random1000 = Math.floor(Math.random() * 3); //from random 1k
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new HikingPlace({
      //set location
      location: ` ${cities[random1000].city} ,${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://unsplash.com/photos/QRU0i5AqEJA",
      description: "lorem ipsum",
      price: price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
