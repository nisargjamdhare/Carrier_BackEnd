import { injectable } from "inversify";
import IUserService from "../Interface/IuserService";
import { ParameterDTO, loginDTO, UserResponse, ModelRequest } from "../DTO/UserDto";
import { User, UserData } from "../Entity/User";
import CareerModel from "../Entity/carriermodel";
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
			const response: any = await axios.post(apiUrl, modelRequest);
			
			let dataString = response.data.data;
			let modelData;
	
			try {
				if (typeof dataString === 'string') {
					// Log the raw string for debugging
					console.log('Raw data string:', dataString);
					
					// Try to find the proper JSON structure
					const jsonMatch = dataString.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						dataString = jsonMatch[0];
					}
	
					// Clean the string of any trailing or leading content
					dataString = dataString.trim();
					
					// Remove any extra characters after the last closing brace
					const lastBraceIndex = dataString.lastIndexOf('}');
					if (lastBraceIndex !== -1) {
						dataString = dataString.substring(0, lastBraceIndex + 1);
					}
	
					// Log the cleaned string
					console.log('Cleaned data string:', dataString);
	
					try {
						modelData = JSON.parse(dataString);
					} catch (parseError) {
						console.error('First parse attempt failed:', parseError);
						
						// Try one more time with stricter cleaning
						dataString = dataString.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
						dataString = dataString.replace(/\\n/g, ''); // Remove newline characters
						dataString = dataString.replace(/\s+/g, ' '); // Normalize whitespace
						
						console.log('Further cleaned string:', dataString);
						modelData = JSON.parse(dataString);
					}
				} else {
					modelData = dataString;
				}
	
				// Validate the structure
				if (!modelData.careerFields || !Array.isArray(modelData.careerFields)) {
					throw new Error('Invalid data structure: missing or invalid careerFields');
				}
	
				const careerData = new CareerModel({
					careerFields: modelData.careerFields,
					improvementSuggestions: modelData.improvementSuggestions || ''
				});
	
				await careerData.save();
				console.log('Data saved successfully:', careerData);
	
				return modelData;
	
			} catch (parseError) {
				console.error('Error parsing or validating data:', parseError);
				console.error('Problematic data string:', dataString);
				
				// If we can see the structure of the error response, log it
				if (response.data) {
					console.log('Full response data:', JSON.stringify(response.data, null, 2));
				}
				
				return {
					careerFields: [],
					improvementSuggestions: "Error parsing model response"
				};
			}
	
		} catch (error) {
			console.error("Error in modelResponse:", error);
			return {
				careerFields: [],
				improvementSuggestions: "Error connecting to the model API or processing response",
			};
		}
	}
	
	


}

export default UserService;
