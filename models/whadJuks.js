const mongoose = require("mongoose");

const whadjuksSchema = new mongoose.Schema({
  Item: String,
  name: String,
  whadjukName: String,
  Meaning: String,
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
whadjuksSchema.index({ location: "2dsphere" });
const Whadjuks = mongoose.model("Whadjuks", whadjuksSchema);

exports.Whadjuks = Whadjuks;
