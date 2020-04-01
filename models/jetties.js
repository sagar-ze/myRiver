const mongoose = require("mongoose");

const jettiesSchema = new mongoose.Schema({
  jettyName: String,
  Address: String,
  "Boat Ramp with jetty": String,
  "Boat Ramp without jetty": String,
  "Public jetty": String,
  Private: String,
  Commercial: String,
  "3D building": String,
  "Google Maps": String,
  Toilet: String,
  Cafe: String,
  location: {
    coordinates: {
      type: [Number]
    },
    type: {
      enum: ["Point", "LineString"]
    }
  }
});
jettiesSchema.index({ location: "2dsphere" });
const Jetties = mongoose.model("Jetties", jettiesSchema);

exports.Jetties = Jetties;
