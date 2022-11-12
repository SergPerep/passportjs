import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("-> Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
};
