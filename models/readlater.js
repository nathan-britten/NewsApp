const mongoose = require("mongoose");

const readLaterScheme = new mongoose.Schema({
  
  image: String, 
  title: String,
  date: String,
  info: String,
  url: String
})

module.exports = mongoose.model("Readlater", readLaterScheme)