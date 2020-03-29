var express = require("express");
var router = express.Router();
const _ = require("lodash");
const turf = require("@turf/turf");
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
    const city = new City();
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
  const { lng, lat } = req.query;
  try {
    const polygon = await Polygon.find({
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          }
        }
      }
    });
    if (!polygon) res.status(400).send("You are outside the Restricted Area");
    res.status(200).send("You are inside the restricted speed limit Area");
  } catch (ex) {
    console.log(ex);
  }
});

/* 
Speed limit
*/
router.get("/near-speed-limit", async (req, res, next) => {
  const { lng, lat,speed } = req.query;
  try {
    const polygon = await Polygon.aggregate([
      {
        $geoNear: {
          near: {
            type: "Polygon",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          distanceField: "dist.calculated",
          //  minDistance:5,
          maxDistance: 1000,
          spherical: true
        }
      }
    ]);
    if (polygon.length === 0 || polygon === undefined)
      return res.status(400).send("You are far away from restricted Area !");
     const{0:{dist:{calculated}}}={...polygon}
     var predictiveTime=await  (calculated/speed)/60
     predictiveTime=  predictiveTime <0.4 ? "Reached the destination": `We will reach destination in `+Math.ceil(predictiveTime)+ ` minute`
 
   res.status(400).send(`We are ${parseInt(calculated) } meters away from from restricted Area\n  ${predictiveTime}`)
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
