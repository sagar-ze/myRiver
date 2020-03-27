const mongoose = require("mongoose");
const { polygonSchema } = require("./polygon");

const citySchema = new mongoose.Schema({
  // name: String,
  location: polygonSchema, 
  type: String
});
//  polygonSchema.index({geometry: '2dsphere'});
const City = mongoose.model("City", citySchema);

module.exports.City = City;
