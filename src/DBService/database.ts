import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const CONNECTION_STRING = process.env.CONNECTION_STRING;

function dbConnection() {
	if (!CONNECTION_STRING) {
		console.error("MongoDB URI is not defined in the environment variables.");
		process.exit(1);
	}
	mongoose.set("bufferTimeoutMS", 30000);

	mongoose
		.connect(CONNECTION_STRING, {
			serverSelectionTimeoutMS: 10000,
			socketTimeoutMS: 30000,
		})
		.then(() => {
			console.log("MongoDB connected");
		})
		.catch((err) => {
			console.error("Error connecting to MongoDB:", err.message);
		});
}

export default dbConnection;
