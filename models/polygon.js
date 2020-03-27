const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  type:String,
  properties: {
    REGTYPE_ID: Number,
    REGTYPE: String,
    NAVWAT_ID: Number,
    Shape_Leng: Number,
    Shape_Area: Number
  },
  geometry: {
    coordinates: {
      type: [Number],
      index: '2dsphere',
      required: true
    },
    type: {
      enum: ["Polygon"]
    
    }
  }
});
polygonSchema.index({ geometry: '2dsphere' }, { background: false })
const Polygon = mongoose.model("Polygon", polygonSchema);

exports.polygonSchema = polygonSchema;
exports.Polygon = Polygon;
