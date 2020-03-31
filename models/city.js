const mongoose = require("mongoose");
const { polygonSchema } = require("./polygon");

const citySchema = new mongoose.Schema({
  features: polygonSchema
});
//create index of the feature collection


const City = mongoose.model("City", citySchema);

module.exports.City = City;
  