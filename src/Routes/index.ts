import { Router } from "express";
import UserController from "../Controller/UserController";
import { injectable } from "inversify";
@injectable()
class UserRoutes {
	private readonly router: Router;
	private readonly userController: UserController;

	constructor(userController: UserController) {
		this.router = Router();
		this.userController = userController;

		this.configureRoutes();
	}

	private configureRoutes() {
		this.router.post("/register", (req, res) => this.userController.register(req, res));
		this.router.post("/login", (req, res) => this.userController.login(req, res));
		this.router.post("/modelResponse" ,(req,res)=> this.userController.modelResponse(req,res));
	}

	getRouter(): Router {
		return this.router;
	}
}

export default UserRoutes;
