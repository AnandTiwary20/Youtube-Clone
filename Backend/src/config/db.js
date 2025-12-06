import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/youtube-clone";

export const PORT = process.env.PORT || 5000;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Mongo connection failed:", err.message);
    process.exit(1);
  }
};
