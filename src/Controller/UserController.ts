import { Request, Response } from "express";
import { IUserService } from "../Interface/IuserService";
import { UserService } from "../Service/userService";
import { IUser } from "../DTO/UserDto";

export class UserController {
  private userService: IUserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      // Prepare user object
      const user: IUser = { name, email, password };

      // Call the service to register the user
      const newUser = await this.userService.registerUser(user);

      res.status(200).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const user = await this.userService.loginUser(email, password);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  }
}



