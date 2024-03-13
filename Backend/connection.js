// connection.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://gowshickh09102021:yZjRPppkyMKwATAP@cluster0.pepmyk0.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

