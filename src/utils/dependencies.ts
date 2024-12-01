import "reflect-metadata";
import express from "express";
import { Container } from "inversify";
import cors from "cors";
import UserService from "../Service/userService";
import UserController from "../Controller/UserController";
import IUserService from "../Interface/IuserService";
import UserRoutes from "../Routes";

const app = express();
app.use(cors());
app.use(express.json()); // Enable JSON parsing for request bodies

// Inversify container setup
const container = new Container();
container.bind<IUserService>("IUserService").to(UserService);
const userController = new UserController(container.get<UserService>("IUserService"));
// Bind routes
const userRoutes = new UserRoutes(userController);

export { userRoutes };
