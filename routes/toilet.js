const express = require("express");
const router = express();
const _ = require("lodash");
const { Toilet } = require("../models/toilet");

router.post("/", async (req, res) => {
  const {
    placeName,
    streetAddress,
    closestJetty,
    longitude,
    latitude
  } = req.body;
  const data = {
    placeName,
    streetAddress,
    closestJetty,
    location: {
      coordinates: [Number(latitude), Number(longitude)]
    }
  };

  const toilet = new Toilet(data);
  await toilet.save();
  res.status(200).json({status:'success',message:'Jetties saved !'});
});

router.get("/", async (req, res) => {
  const { lat, lng } =req.query;

  const toilet = await Toilet.aggregate([
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
  if (toilet === undefined || toilet.length === 0)
  return res.status(400).json({status:'failure',message:"toilet not found"});
  res.status(200).json({status:'success',message:"There a toilet near 1 km radius",data:toilet});
});

module.exports = router;
