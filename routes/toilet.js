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
  res.status(200).send("Successful !");
});

router.get("/", async (req, res) => {
  const { lat, lng } =req.query;
  console.log(req.query);
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
    return res.status(200).send("Toilet not found");
  res.status(200).send(toilet);
});

module.exports = router;
