const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose")
const Preference = require("./preference")

const readLaterSchema= new mongoose.Schema({
  
  image: String, 
  title: String,
  date: String,
  info: String,
  url: String
})

const UserSchema  = new mongoose.Schema({
  
  username: String,
  password: String,
  preferences: Array,
  popularSearch: String,
  readLater: [readLaterSchema]
})


UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Readlater", readLaterSchema)

module.exports = mongoose.model("User", UserSchema)
