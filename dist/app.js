"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./Routes/index"));
const app = (0, express_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Load routes
app.use("/User", index_1.default);
exports.default = app;
