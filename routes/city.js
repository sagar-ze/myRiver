var express = require("express");
var router = express.Router();
const _ = require("lodash");
const { City } = require("../models/city");

router.post("/city", async function (req, res) {
  const city = new City(req.body);
  await city.save();
  res
    .status(200)
    .json({ status: "success", message: "data saved" });
});

/* 
Inside restricted Area
*/
router.get("/inside-restricted-area", async function (req, res) {
  const { lng, lat, speed } = req.query;

  const city = await City.find({
    "features.geometry": {
      $geoIntersects: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      },
    },
  });
  if (city.length === 0 || city === undefined)
    return res
      .status(400)
      .json({
        status: "failure",
        message: "You are outside the Restricted Area",
      });
  const {
    0: {
      features: {
        properties: { REGTYPE },
      },
    },
  } = { ...city };
  if (speed > 5 && REGTYPE === "5 knot") {
    res
      .status(200)
      .json({
        status: "success",
        message: "You are over the speed in 5 knot area",
        data: city,
      });
  } else if (speed > 8 && REGTYPE === "8 knot") {
    res
      .status(200)
      .json({
        message:"success",
        message: "You are over the speed in 8 knot area",
        suggestion: "Please lower the speed",
        data: city,
      });
  } else {
    return res
      .status(200)
      .json({status:'success', message: "You have a fine speed", emoji: "😇" });
  }
});

/* 
Speed limit
*/
router.get("/near-speed-limit", async (req, res) => {
  const { lng, lat, speed } = req.query;
  const city = await City.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: "dist.calculated",
        //  minDistance:5,
        maxDistance: 1000,
        spherical: true,
        key: "features.geometry",
      },
    },
  ]);
  if (city.length === 0 || city === undefined)
    return res
      .status(400)
      .json({
        status: "failure",
        message: "There is no any data near 1km radius",
      });
  const {
    0: {
      dist: { calculated },
    },
  } = { ...city };
  var predictiveTime = (await (calculated / speed)) / 60;
  predictiveTime =
    predictiveTime < 0.4
      ? "Reached the destination"
      : `We will reach destination in ` + Math.ceil(predictiveTime) + ` minute`;

  res.status(200).json({
    status: "success",
    message: `We are ${parseInt(
      calculated
    )} meters away from from restricted Area\n  ${predictiveTime}`,
    data: city,
  });
});

module.exports = router;
