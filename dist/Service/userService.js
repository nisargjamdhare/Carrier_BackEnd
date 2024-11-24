"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGO_URI || "";
const client = new mongodb_1.MongoClient(uri);
class UserService {
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.connect();
                const db = client.db("mydatabase");
                const collection = db.collection("users");
                // Insert user into the database
                const result = yield collection.insertOne(user);
                // Add the generated ID to the user object
                return Object.assign(Object.assign({}, user), { id: result.insertedId.toString() });
            }
            catch (error) {
                console.error("Error registering user:", error);
                throw new Error("Failed to register user");
            }
            finally {
                yield client.close();
            }
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield client.connect();
                const db = client.db("mydatabase");
                const collection = db.collection("users");
                // Find the user by email and password
                const user = yield collection.findOne({ email, password });
                return user ? Object.assign(Object.assign({}, user), { id: (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString() }) : null;
            }
            catch (error) {
                console.error("Error logging in user:", error);
                throw new Error("Failed to login user");
            }
            finally {
                yield client.close();
            }
        });
    }
}
exports.UserService = UserService;
