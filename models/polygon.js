const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  type: String,
  properties: {
    REGTYPE_ID: Number,
    REGTYPE: String,
    NAVWAT_ID: Number,
    Shape_Leng: Number,
    Shape_Area: Number
  },
  geometry: {
    coordinates: {
      type: [[[Number]]]
    },
    type: {
      type: "String",
      default: "Polygon"
    }
  }
});
polygonSchema.index({ geometry: "2dsphere" });
const Polygon = mongoose.model("Polygon", polygonSchema);

exports.polygonSchema = polygonSchema;
exports.Polygon = Polygon;
// const mongoose = require("mongoose");

// const polygonSchema = new mongoose.Schema({

//   location: {
//     coordinates: {
//       type: [[[Number]]]
//     },
//     type: {
//       type: "String",
//       default: "Polygon"
//     }
//   }
// });
//  polygonSchema.index({ location: "2dsphere" });
// const Polygon = mongoose.model("Polygon", polygonSchema);

// exports.polygonSchema = polygonSchema;
// exports.Polygon = Polygon;
