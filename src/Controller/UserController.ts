import { Request, Response } from "express";
import { injectable } from "inversify";
import UserService from "../Service/userService";
import { RequestDTO } from "../DTO/UserDto";
@injectable()
class UserController {
	private userService: UserService;

	constructor(userService: UserService) {
		this.userService = userService;
	}

	async register(req: Request, res: Response): Promise<void> {
		try {
			const response = await this.userService.registerUser(req.body);

			if (response != null) {
				res.status(200).json(response);
			} else {
				console.error("Data not found");
				res.status(404).json("Error in Registering USer");
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json("Internal Server Error");
		}
	}

	async login(req: Request, res: Response): Promise<void> {
		try {
			const response = await this.userService.loginUser(req.body);

			if (response != null) {
				res.status(200).json(response);
			} else {
				console.error("Data not found");
				res.status(404).json("Error in Login USer");
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json("Error In Login USer");
		}
	}


	async modelResponse(req: Request, res: Response): Promise<void> {
		try {
			const response = await this.userService.modelResponse(req.body);

			if (response != null) {
				res.status(200).json(response);
			} else {
				console.error("Data not found");
				res.status(404).json("Error in Login USer");
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json("Error In Login USer");
		}
	}

	async insertCollegesFromExcel(req: Request, res: Response): Promise<void> {
		try {
			const response = await this.userService.insertCollegesFromExcel(req.body);

			if (response != null) {
				res.status(200).json(response);
			} else {
				console.error("Data not found");
				res.status(404).json("Error in Login USer");
			}
		} catch (error: any) {
			console.error("Error in processing", error);
			res.status(500).json("Error In Login USer");
		}
	}

	async getColleges(req: Request, res: Response): Promise<any> {
		try {

			const response = await this.userService.getColleges(req.body);
			if (response != null) {
				res.status(200).json(response);
		}
	   else {
		console.error("Data not found");
		res.status(404).json("Error in Login USer");
	}
    } catch (error:any) {
		console.error("Error in processing", error);
		res.status(500).json("Error In Login USer");
		}
	}


	async getCarrierData(req: Request, res: Response): Promise<any> {
		try {

			const response = await this.userService.getCarrierData(req.body);
			if (response != null) {
				res.status(200).json(response);
		}
	   else {
		console.error("Data not found");
		res.status(404).json("Error in Login USer");
	}
    } catch (error:any) {
		console.error("Error in processing", error);
		res.status(500).json("Error In Login USer");
		}
	}

	}




export default UserController;
