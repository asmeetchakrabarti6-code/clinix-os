const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/clinix_db";
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[MongoDB Notice]: Set a valid MONGODB_URI in server/.env file (e.g., MongoDB Atlas connection string).`);
  }
};

module.exports = connectDB;
