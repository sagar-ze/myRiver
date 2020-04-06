var express = require("express");
var router = express.Router();
const _ = require("lodash");
const { City } = require("../models/city");
const { Polygon } = require("../models/polygon");

router.post("/polygon", async function(req, res, next) {
  try {
    const polygon = new Polygon(req.body);
    await polygon.save();
    res.send(polygon);
  } catch (ex) {
    console.log("Something failure", ex);
  }
});

router.post("/city", async function(req, res, next) {
  try {
    const city = new City(req.body);
    await city.save();
    res.send("Saved");
  } catch (ex) {
    console.log("We got some exception", ex);
  }
});

router.get("/city", async function(req, res, next) {
  try {
    const city = await City.find();
    res.send(city);
  } catch (ex) {
    console.log("we got some exception", ex);
  }
});
/* 
Inside restricted Area
*/
router.get("/inside-restricted-area", async function(req, res, next) {
  const { lng, lat, speed } = req.query;

      const polygon = await City.find({
        "features.geometry": {
          $geoIntersects: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            }
          }
        }
      });
      if (polygon.length === 0 || polygon === undefined)
        return res.status(400).send("You are outside the Restricted Area");
        const {
          0: {
            features: { properties:{REGTYPE} }
          }
        } = { ...polygon };
        // console.log(REGTYPE)
        if (speed > 5 && REGTYPE==="5 knot") {
          res.status(200).send({message:"You are over the speed in 5 knot area"})
        }
      else if(speed > 8 && REGTYPE==="8 knot") {
        res.status(200).send({message:"You are over the speed in 8 knot area",suggestion:"Please lower the speed"})
      } else {
      return res.status(200).send({message:'You have a fine speed', emoji: "😇" });
    }
});

/* 
Speed limit
*/
router.get("/near-speed-limit", async (req, res, next) => {
  const { lng, lat, speed } = req.query;
    const polygon = await City.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "dist.calculated",
          //  minDistance:5,
          maxDistance: 1000,
          spherical: true,
          key: "features.geometry"
        }
      }
    ]);
    if (polygon.length === 0 || polygon === undefined)
      return res.status(400).send("You are far away from restricted Area !");
    const {
      0: {
        dist: { calculated }
      }
    } = { ...polygon };
    var predictiveTime = (await (calculated / speed)) / 60;
    predictiveTime =
      predictiveTime < 0.4
        ? "Reached the destination"
        : `We will reach destination in ` +
          Math.ceil(predictiveTime) +
          ` minute`;

    res
      .status(200)
      .send(
        `We are ${parseInt(
          calculated
        )} meters away from from restricted Area\n  ${predictiveTime}`
      );
});

module.exports = router;
