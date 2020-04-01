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
  res.status(200).send("Successful !");
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
    return res.status(200).send("WhadJuks not found");
  res.status(200).send(whadJuks);
});

module.exports = router;
