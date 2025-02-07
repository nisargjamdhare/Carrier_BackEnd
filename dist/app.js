"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const database_1 = __importDefault(require("./DBService/database"));
const dependencies_1 = require("./utils/dependencies");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("API Running");
});
app.use("/User", dependencies_1.userRoutes.getRouter());
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
(0, database_1.default)();
