const express = require("express");
const router = express();
const _ = require("lodash");
const { Whadjuks } = require("../models/whadJuks");

router.post("/", async (req, res) => {
  const { Item, name, whadjukName, Meaning, latitude,longitude } = req.body;

  const whadjuks = new Whadjuks({
    Item,
    name,
    whadjukName,
    Meaning,
    location: {
      coordinates: [Number(latitude), Number(longitude)]
    }
  });
  await whadjuks.save();
  res.status(200).json({status:'success',message:'Jetties saved !'});
});

router.get("/", async (req, res) => {
  const { lat, lng } = req.query;

  const whadJuks = await Whadjuks.aggregate([
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
  if (whadJuks === undefined || whadJuks.length === 0)
  return res.status(400).json({status:'failure',message:"whadjuks not found"});
  res.status(200).json({status:'success',message:"There a whadjuks near 1 km radius",data: whadJuks});
});

module.exports = router;
