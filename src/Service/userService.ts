import { injectable } from "inversify";
import IUserService from "../Interface/IuserService";
import { ParameterDTO, loginDTO, UserResponse, ModelRequest } from "../DTO/UserDto";
import { User, UserData } from "../Entity/User";
import axios from "axios";


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

			const user = await UserData.findOne({ email: body.email });
			if (!user) {
				return "Error: User does not exist";
			}

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

			return userResponse;
		} catch (error) {
			console.error("Error logging in user:", error);
			return "Error logging in user";
		}
	}

	async modelResponse(modelRequest: ModelRequest): Promise<{ careerFields: any[]; improvementSuggestions: string }> {
		try {
			const apiUrl = "https://carrier-model-api.onrender.com/chat";
	
			// Send the request to the model API
			const response: any = await axios.post(apiUrl, modelRequest);
	
			// Extract the raw response data
			const modelData: any = response.data;
	
			// Debugging: Log the raw response
			console.log("Raw modelData.response:", modelData);
	
			// Extract only the valid JSON portion
			const validJson = modelData.data.match(/\{[\s\S]*?\}/)?.[0];
			if (!validJson) {
				throw new Error("Invalid JSON structure in response");
			}
	
			
			const parsedResponse = validJson;
	
		return  parsedResponse;
			
	
		} catch (error) {
			console.error("Error in modelResponse:", error);
	
			// Return default values on error
			return {
				careerFields: [],
				improvementSuggestions: "Error connecting to the model API or parsing response",
			};
		}
	}
	
	


}

export default UserService;
