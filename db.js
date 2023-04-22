const mongoose = require("mongoose");

const MongoURI = "mongodb://127.0.0.1:27017/connectme";

const connect = () => {
  mongoose.connect(MongoURI);
};

if (connect) {
  console.log("Connected");
} else {
  console.log("Database not connected");
}

module.exports = connect;