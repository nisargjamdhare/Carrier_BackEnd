"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../Controller/UserController");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
// Register API
router.post("/register", userController.register.bind(userController));
router.post("/login", (req, res) => userController.login(req, res));
exports.default = router;
