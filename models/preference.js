const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema({
  
  preference: Array
})

module.exports = mongoose.model("Preference", preferenceSchema)