import { injectable } from "inversify";
import IUserService from "../Interface/IuserService";
import { ParameterDTO, loginDTO, UserResponse } from "../DTO/UserDto";
import { User, UserData } from "../Entity/User";

@injectable()
class UserService implements IUserService {
	async registerUser(body: ParameterDTO): Promise<string> {
		try {
			// Validate input
			if (!body) {
				return "Error: User data is required";
			}

			// Check if the email already exists
			const existingData = await UserData.findOne({ email: body.email });
			if (existingData) {
				return " User with this email already exists";
			}

			// Create User instance and initialize it
			const user = new User(
				{
					userName: body.name,
					email: body.email,
					mobileNumer: body.mobileNumer,
					userPassword: body.password,
				},
				true,
				"system",
				"System"
			);

			// Create a new UserData instance from the User object
			const newUser = new UserData(user);

			// Save user to the database
			const result = await newUser.save();

			return `User registered successfully with ID: ${result._id}`;
		} catch (error) {
			console.error("Error registering user:", error);
			return "Error: An unexpected error occurred while registering the user";
		}
	}

	async loginUser(body: loginDTO): Promise<UserResponse | string> {
		try {
			// Validate input
			if (!body || !body.email || !body.password) {
				return "Error: Email and password are required";
			}

			// Check if the user exists in the database
			const user = await UserData.findOne({ email: body.email });
			if (!user) {
				return "Error: User does not exist";
			}

			// Verify the password
			if (user.userPassword !== body.password) {
				return "Error: Incorrect password";
			}

			let userResponse: UserResponse = {
				name: "",
				email: "",
			};
			if (user) {
				userResponse = {
					name: user.userName,
					email: user.email,
				};
			}

			// Return success message
			return userResponse;
		} catch (error) {
			console.error("Error logging in user:", error);
			return "Error logging in user";
		}
	}
}

export default UserService;
