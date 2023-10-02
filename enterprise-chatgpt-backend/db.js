const mongoose = require("mongoose");

module.exports.db = function () {
  mongoose
    .connect("mongodb://0.0.0.0:27017/Test3")
    .then(() => {
      console.log("mongodb connected");
    })
    .catch(() => {
      console.log("error in connecting db");
    });
};
