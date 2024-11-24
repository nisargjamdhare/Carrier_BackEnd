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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../Service/userService");
class UserController {
    constructor() {
        this.userService = new userService_1.UserService();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                // Validate input
                if (!name || !email || !password) {
                    res.status(400).json({ message: "All fields are required" });
                    return;
                }
                // Prepare user object
                const user = { name, email, password };
                // Call the service to register the user
                const newUser = yield this.userService.registerUser(user);
                res.status(201).json({
                    message: "User registered successfully",
                    user: newUser,
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Validate input
                if (!email || !password) {
                    res.status(400).json({ message: "Email and password are required" });
                    return;
                }
                const user = yield this.userService.loginUser(email, password);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(401).json({ message: "Invalid email or password" });
                }
            }
            catch (error) {
                console.error("Error in login:", error);
                res.status(500).json({ message: "Failed to login" });
            }
        });
    }
}
exports.UserController = UserController;
