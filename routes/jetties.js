const express = require("express");
const router = express();
const _ = require("lodash");
const { Jetties } = require("../models/jetties");

router.post("/", async (req, res) => {
  let data = await _.pick(req.body, [
    "jettyName",
    "Address",
    "Boat Ramp with jetty",
    "Boat Ramp without jetty",
    "Public jetty",
    "Private",
    "Commercial",
    "3D building",
    "Google Maps",
    "Toilet",
    "Cafe"
  ]);
  data = await {
    ...data,
    location: {
      coordinates: req.body.coordinates,
      type: "LineString"
    }
  };
  let jetties = new Jetties(data);
  jetties.save();
  res.status(200).json({status:'success',message:'Jetties saved !'});
});

router.get("/", async (req, res) => {
    const { lat, lng } =req.query;
    const jetties = await Jetties.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [Number(lng), Number(lat)]
          },
          distanceField: "dist.calculated",
          maxDistance: 1000,
          spherical: true
        }
      }
    ]);
    if (jetties === undefined || jetties.length === 0)
      return res.status(400).json({status:'failure',message:"Jetties not found"});
    res.status(200).json({status:'success',message:"There a Jetties near 1 km radius",data:jetties});
  });
module.exports = router;
