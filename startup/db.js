const mongoose = require("mongoose");
const dbDebug = require("debug")("app:db");

module.exports = () => {
  mongoose
    //  .connect("mongodb+srv://sagar:sagar@cluster0-zgbsj.mongodb.net/test?retryWrites=true&w=majority", {
     .connect("mongodb://localhost/geoSpatial", {

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(success => console.log("Database is up an running!"))
    .catch(ex => console.log("Database server is down..."));
};