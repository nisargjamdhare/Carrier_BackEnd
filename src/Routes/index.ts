import { Router } from "express";
import { UserController } from "../Controller/UserController";

const router = Router();
const userController = new UserController();

// Register API
router.post("/register", userController.register.bind(userController));
router.post("/login", (req, res) => userController.login(req, res));

export default router;
