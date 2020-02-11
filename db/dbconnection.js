const mongoose = require("mongoose");
const { mongoDBUri } = require("../config/config");

const options = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

function dbConnection() {
  mongoose.connect(mongoDBUri, options, err => {
    if (err) {
      console.log("MongoDB connection err :", err);
      process.exit(1);
    }

    if (!err) {
      console.log("Database connection successful");
    }
  });
}

module.exports = dbConnection;
