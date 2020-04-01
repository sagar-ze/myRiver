const mongoose = require("mongoose");

const toiletSchema = new mongoose.Schema({
  placeName: String,
  streetAddress: String,
  closestJetty: String,
  location: {
    coordinates: {
      type: [Number]
    },
    type: {
      type: String,
      default: "Point"
    }
  }
});
toiletSchema.index({ location: "2dsphere" });
const Toilet = mongoose.model("Toilet", toiletSchema);

exports.Toilet = Toilet;
