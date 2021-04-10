const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HikersSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Hikers", HikersSchema);
