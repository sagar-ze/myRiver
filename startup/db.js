const mongoose = require("mongoose");
const dbDebug = require("debug")("app:db");

module.exports = () => {
  mongoose
    //  .connect(config.get('db), {
     .connect("mongodb://localhost/sagar", {

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    .then(success => console.log("Database is up an running!"))
    .catch(ex => console.log("Database server is down..."));
};