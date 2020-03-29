// const mongoose = require("mongoose");

// const polygonSchema = new mongoose.Schema({
//   type: String,
//   properties: {
//     REGTYPE_ID: Number,
//     REGTYPE: String,
//     NAVWAT_ID: Number,
//     Shape_Leng: Number,
//     Shape_Area: Number
//   },
//   geometry: {
//     coordinates: {
//       type: [[[Number]]],
//       // required: true
//     },
//     type: {
//       enum: ["Polygon"]
//     },
//   }
// });
//  polygonSchema.index({ 'geometry.coordinates': "2dsphere" });
// const Polygon = mongoose.model("Polygon", polygonSchema);
// Polygon.on('index', function(error) {
//   // "_id index cannot be sparse"
//   if(error) console.log(error);
// });
// exports.polygonSchema = polygonSchema;
// exports.Polygon = Polygon;
const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({

  location: {
    coordinates: {
      type: [[[Number]]]
    },
    type: {
      type: "String",
      default: "Polygon"
    }
  }
});
 polygonSchema.index({ location: "2dsphere" });
const Polygon = mongoose.model("Polygon", polygonSchema);

exports.polygonSchema = polygonSchema;
exports.Polygon = Polygon;
