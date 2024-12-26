const mongoose = require("mongoose");
require("dotenv").config();

const dbUri = process.env.DB_URI;
const dbUriLocal = process.env.DB_URI_LOCAL;

const connectToDatabase = () => {
  mongoose
    .connect(const dbUri = process.env.DB_URI;
      , {
      dbName: "Network",
    })
    .then(() => {
      console.log("MongoDB connected...");
    });
};

module.exports = { connectToDatabase };
