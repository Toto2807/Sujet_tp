import "dotenv/config";
import mongoose from "mongoose";

const mongoURI = process.env.DB_MONGO_URI;

export const connectMongo = async () => {
    await mongoose.connect(mongoURI);
};
