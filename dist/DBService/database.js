"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONNECTION_STRING = process.env.CONNECTION_STRING;
function dbConnection() {
    console.log("connection string : ", CONNECTION_STRING);
    if (!CONNECTION_STRING) {
        console.error("MongoDB URI is not defined in the environment variables.");
        process.exit(1);
    }
    mongoose_1.default.set("bufferTimeoutMS", 30000);
    mongoose_1.default
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
exports.default = dbConnection;
