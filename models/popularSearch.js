const mongoose = require("mongoose");

const popularSearchSchema = new mongoose.Schema({
  
  popularSearch: String
})

module.exports = mongoose.model("PopularSearch", popularSearchSchema)



