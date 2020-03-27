var express = require("express");
var router = express.Router();
const { City } = require("../models/city");
const { Polygon } = require("../models/polygon");

/* GET home page. */
router.post("/polygon", async function(req, res, next) {
  try {
    const polygon = new Polygon(req.body);
    await polygon.save();
    res.send("Saved");
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
router.get("/near", async function(req, res, next) {
   console.log(req.query);
  try {
    Polygon.aggregate([
      {
        $geoNear: {
          near: {
            type: "Feature",
             $geometry: {
              coordinates: [
                parseFloat(req.query.lng),
                parseFloat(req.query.lat)
              ]
             }
          },
           distanceField: "geometry.distance",
          maxDistance: 10000,
          spherical: true,
        }
      },{ "$sort": { "distance": -1 } }
    ]).then(function(err,Locs) {
      if(err) console.log(err)
      res.send(Locs);
    });
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
