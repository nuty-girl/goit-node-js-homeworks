require("dotenv").config();

module.exports = {
  mongoDBUri: process.env.MONGO_DB_URI,
  port: process.env.PORT || 5000,
  mode: process.env.NODE_ENV || "production"
};
