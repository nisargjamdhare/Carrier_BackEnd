import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "";
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    return client.db("mydatabase");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
