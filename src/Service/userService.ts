import { injectable } from "inversify";
import IUserService from "../Interface/IuserService";
import { ParameterDTO, loginDTO, UserResponse, ModelRequest, RequestDTO } from "../DTO/UserDto";
import { User, UserData } from "../Entity/User";
import CareerModel from "../Entity/carriermodel";
import CollegeModel from "../Entity/CollegeEntity";
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
			const apiUrl1 = "https://carrier-model-api.onrender.com/chat";
			const apiUrl2 = "https://model2-gemini-model.onrender.com/chat";
			
			let response: any = await axios.post(apiUrl1, modelRequest);
		
		// If the response is empty or invalid, try the second API
		if (!response.data || typeof response.data !== 'string' || response.data.length === 0) {
			console.warn("First API response invalid, trying fallback API...");
			response = await axios.post(apiUrl2, modelRequest);
		}

			if (!response?.data) {
				throw new Error("Empty response from both APIs");
			}
	
			let dataString = response.data;
	
			// Attempt to clean and parse JSON
			let modelData;
			try {
				if (typeof dataString === 'string') {
					
	
					// Extract JSON content
					const jsonMatch = dataString.match(/\{[\s\S]*\}/);
					if (jsonMatch) {
						dataString = jsonMatch[0];
					}
	
					// Remove trailing content after last brace
					dataString = dataString.trim();
					const lastBraceIndex = dataString.lastIndexOf('}');
					if (lastBraceIndex !== -1) {
						dataString = dataString.substring(0, lastBraceIndex + 1);
					}
	
					console.log('Cleaned data string:', dataString);
	
					try {
						modelData = JSON.parse(dataString);
					} catch (parseError) {
						console.error('First parse attempt failed:', parseError);
						
						// Stricter cleaning attempt
						dataString = dataString.replace(/[\x00-\x1F\x7F-\x9F]/g, ''); // Remove control characters
						dataString = dataString.replace(/\\n/g, ''); // Remove newline characters
						dataString = dataString.replace(/\s+/g, ' '); // Normalize spaces
						
						console.log('Further cleaned string:', dataString);
						modelData = JSON.parse(dataString);
					}
				} else {
					modelData = dataString;
				}
			} catch (error) {
				console.error('Error parsing model response:', error);
				console.error('Problematic data string:', dataString);
	
				return {
					careerFields: [],
					improvementSuggestions: "Error parsing model response",
				};
			}
	
			// Validate structure
			if (!modelData.careerFields || !Array.isArray(modelData.careerFields)) {
				console.error("Invalid data structure: missing or invalid careerFields");
				throw new Error("Invalid data structure");
			}
	
			// Save to DB
			const careerData = new CareerModel({
				careerFields: modelData.careerFields,
				improvementSuggestions: modelData.improvementSuggestions || ''
			});
	
			await careerData.save();
			console.log('Data saved successfully:', careerData);
	
			return modelData;
	
		} catch (error) {
			console.error("Error in modelResponse:", error);
			return {
				careerFields: [],
				improvementSuggestions: "Error connecting to the model API or processing response",
			};
		}
	}

	async  insertCollegesFromExcel(body:any) {
		try {
			const college_data =[
				{
				  collegeName: "Hindu College",
				  collegeLocation: "Delhi",
				  collegeFees: 80600,
				  Rank: 1,
				  officialWebsite: "http://www.hinducollege.ac.in/"
				},
				{
				  collegeName: "Miranda House",
				  collegeLocation: "Delhi",
				  collegeFees: 44670,
				  Rank: 2,
				  officialWebsite: "https://www.mirandahouse.ac.in/"
				},
				{
				  collegeName: "Lady Shri Ram College for Women",
				  collegeLocation: "Delhi",
				  collegeFees: 53670,
				  Rank: 4,
				  officialWebsite: "https://lsr.edu.in/"
				},
				{
				  collegeName: "Kirori Mal College",
				  collegeLocation: "Delhi",
				  collegeFees: 38925,
				  Rank: 5,
				  officialWebsite: "https://www.kmcollege.ac.in/"
				},
				{
				  collegeName: "Hansraj College",
				  collegeLocation: "Delhi",
				  collegeFees: 540,
				  Rank: 6,
				  officialWebsite: "https://www.hansrajcollege.ac.in/"
				},
				{
				  collegeName: "St. Xavier's College, Mumbai",
				  collegeLocation: "Mumbai",
				  collegeFees: 23361,
				  Rank: null,
				  officialWebsite: "https://xaviers.edu/"
				},
				{
				  collegeName: "Loyola College",
				  collegeLocation: "Chennai",
				  collegeFees: 42570,
				  Rank: 8,
				  officialWebsite: "https://www.loyolacollege.edu/"
				},
				{
				  collegeName: "Presidency College",
				  collegeLocation: "Chennai",
				  collegeFees: null,
				  Rank: 13,
				  officialWebsite: "https://www.presidency.edu/"
				},
				{
				  collegeName: "Madras Christian College",
				  collegeLocation: "Chennai",
				  collegeFees: 56157,
				  Rank: 5,
				  officialWebsite: "https://www.mcc.edu.in/"
				},
				{
				  collegeName: "Jawaharlal Nehru University",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.jnu.ac.in/"
				},
				{
				  collegeName: "Christ University",
				  collegeLocation: "Bengaluru",
				  collegeFees: 150000,
				  Rank: null,
				  officialWebsite: "https://christuniversity.in/"
				},
				{
				  collegeName: "Symbiosis College of Arts and Commerce",
				  collegeLocation: "Pune",
				  collegeFees: 50000,
				  Rank: null,
				  officialWebsite: "https://symbiosiscollege.edu.in/"
				},
				{
				  collegeName: "Fergusson College",
				  collegeLocation: "Pune",
				  collegeFees: 10000,
				  Rank: null,
				  officialWebsite: "https://www.fergusson.edu/"
				},
				{
				  collegeName: "St. Joseph's College of Commerce",
				  collegeLocation: "Bengaluru",
				  collegeFees: 30000,
				  Rank: null,
				  officialWebsite: "https://sjcc.edu.in/"
				},
				{
				  collegeName: "Mount Carmel College",
				  collegeLocation: "Bengaluru",
				  collegeFees: 40000,
				  Rank: null,
				  officialWebsite: "https://www.mountcarmelcollege.in/"
				},
				{
				  collegeName: "Jesus and Mary College",
				  collegeLocation: "Delhi",
				  collegeFees: 50000,
				  Rank: null,
				  officialWebsite: "https://www.jmc.ac.in/"
				},
				{
				  collegeName: "Maitreyi College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://maitreyi.ac.in/"
				},
				{
				  collegeName: "Daulat Ram College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.daulatramcollege.edu.in/"
				},
				{
				  collegeName: "Gargi College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.gargicollege.in/"
				},
				{
				  collegeName: "Indraprastha College for Women",
				  collegeLocation: "Delhi",
				  collegeFees: 540,
				  Rank: null,
				  officialWebsite: "https://ipcollege.ac.in/"
				},
				{
				  collegeName: "Kamala Nehru College",
				  collegeLocation: "Delhi",
				  collegeFees: 1080,
				  Rank: null,
				  officialWebsite: "https://www.knc.edu.in/"
				},
				{
				  collegeName: "Lady Irwin College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.ladyirwin.edu.in/"
				},
				{
				  collegeName: "Maharaja Agrasen College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://mac.du.ac.in/"
				},
				{
				  collegeName: "Motilal Nehru College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.mlncdu.ac.in/"
				},
				{
				  collegeName: "Ramjas College",
				  collegeLocation: "Delhi",
				  collegeFees: 44720,
				  Rank: null,
				  officialWebsite: "https://www.ramjascollege.edu/"
				},
				{
				  collegeName: "Ramanujan College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://ramanujancollege.ac.in/"
				},
				{
				  collegeName: "Satyawati College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://satyawati.du.ac.in/"
				},
				{
				  collegeName: "Shaheed Bhagat Singh College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.sbsec.org/"
				},
				{
				  collegeName: "Shivaji College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://shivajicollege.ac.in/"
				},
				{
				  collegeName: "Sri Aurobindo College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.aurobindo.du.ac.in/"
				},
				{
				  collegeName: "Sri Venkateswara College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.svc.ac.in/"
				},
				{
				  collegeName: "Vivekananda College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.vivekanandacollege.edu.in/"
				},
				{
				  collegeName: "Zakir Husain Delhi College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.zakirhusaindelhicollege.in/"
				},
				{
				  collegeName: "Bharati College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://bharaticollege.du.ac.in/"
				},
				{
				  collegeName: "College of Art",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.collegeofart.com/"
				},
				{
				  collegeName: "Delhi College of Arts and Commerce",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.dcac.du.ac.in/"
				},
				{
				  collegeName: "Kalindi College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.kalindi.du.ac.in/"
				},
				{
				  collegeName: "PGDAV College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://pgdav.du.ac.in/"
				},
				{
				  collegeName: "Rajdhani College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.rajdhani.du.ac.in/"
				},
				{
				  collegeName: "Sri Guru Gobind Singh College of Commerce",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.sggsc.ac.in/"
				},
				{
				  collegeName: "Sri Guru Nanak Dev Khalsa College",
				  collegeLocation: "Delhi",
				  collegeFees: null,
				  Rank: null,
				  officialWebsite: "https://www.sgndkc.du.ac.in/"
				}
			  ];
			const colleges = college_data.map((entry) => ({
				collegeName: entry["collegeName"],
				collegeLocation: entry["collegeLocation"],
				collegeFees: isNaN(Number(entry["collegeFees"])) ? null : Number(entry["collegeFees"]),
				Rank: entry["Rank"] ? Number(entry["Rank"]) : null,
				officialWebsite: entry["officialWebsite"] || null,
				collegeType: "Arts & Humanities",
			}));
	
			await CollegeModel.insertMany(colleges);
			console.log("Colleges inserted successfully");
		} catch (error) {
			console.error("Error inserting colleges: ", error);
		}
	}


	async getCarrierData(body: any): Promise<any> {
		try {
			const carrierData = await CareerModel.find({});
			return carrierData;
		} catch (error) {
			console.error("Error fetching colleges:", error);
			throw new Error("Failed to fetch colleges");
		}
	}

	async getColleges(body: RequestDTO): Promise<any> {
		try {
			const categories: Record<string, string[]> = {
				"Engineering": [
					"Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering",
					"Web Development (Front-End)", "Web Development (Back-End)", "Web Development (Full-Stack)",
					"Data Science", "Artificial Intelligence & Machine Learning", "Cybersecurity", "Blockchain Development",
					"Embedded Systems Engineering", "Internet of Things (IoT) Engineer", "Cloud Computing & DevOps",
					"Game Development", "Operations Research Analyst", "Quantitative Analyst (Quant)", "Robotics & Automation Engineering",
					"Software Engineering", "Telecommunications Engineering", "Aerospace Engineering", "Automobile Engineering",
					"Structural Engineering", "Chemical Engineering", "Biomedical Engineering", "Environmental Engineering",
					"Industrial & Production Engineering", "Instrumentation & Control Engineering", "Research Scientist (Mathematics or related fields)",
					"Technical Writing (for technical products and software documentation)"
				],
				"Arts & Humanities": [
					"Journalism", "Content Writing", "Public Relations", "Social Work", "Creative Writing", "Photography",
					"Filmmaking & Cinematography", "Graphic Design", "Performing Arts (Music, Dance, Theater, Acting)",
					"Fine Arts & Painting", "History & Archaeology", "Linguistics & Translation", "Anthropology & Sociology",
					"UX/UI Design", "Marketing & Advertising (Creative Direction)", "Technical Writing",
					"Journalist or News Reporter", "Public Relations Specialist", "Content Writer or Editor", "Social Worker or Counselor"
				],
				"Medical": [
					"Doctor", "Nursing", "Pharmacy", "Dentistry", "Physiotherapy", "Radiology & Medical Imaging",
					"Veterinary Science", "Biomedical Science & Biotechnology", "Public Health Administration", "Healthcare Management",
					"Nutrition & Dietetics", "Psychology & Mental Health Counseling", "Occupational Therapy", "Genetic Counseling",
					"Paramedical Sciences (Lab Technician, EMT, etc.)", "Medical Equipment & Device Engineering",
					"Forensic Science & Pathology", "Epidemiology", "Health Informatics", "Medical Research Scientist",
					"Actuarial Science (as it deals with risk assessment in medical insurance)",
					"Statistician (for medical research and data analysis)", "Research Scientist (for medical and life sciences)",
					"Operations Research Analyst (for hospital and healthcare management)"
				],
				"Business": [
					"Finance", "Marketing", "Entrepreneurship", "Product Management", "Marketing & Advertising",
					"Project Management", "Business Analyst", "Accounting & Auditing", "Investment Banking",
					"Supply Chain Management", "Human Resource Management", "Corporate Law", "Economics", "Risk Management",
					"Real Estate Management", "E-Commerce & Digital Marketing", "Retail Management", "Consulting",
					"Operations Management"
				]
			};
	
			const requestedFields = body.careerFields.map((cf) => cf.field);
			
			// Count matches for each category with proper typing
			const categoryMatches: Record<string, number> = {};
			
			// Initialize counts for all categories
			Object.keys(categories).forEach(category => {
				categoryMatches[category] = 0;
			});
			
			// Count matches
			for (const category in categories) {
				categoryMatches[category] = requestedFields.filter(
					(field: any) => categories[category].includes(field)
				).length;
			}
			
			// Find the category with the most matches
			let determinedCollegeType: string  = "default";
			let maxMatches = 0;
			
			for (const category in categoryMatches) {
				if (categoryMatches[category] > maxMatches) {
					maxMatches = categoryMatches[category];
					determinedCollegeType = category;
				}
			}
			
			
			
			const colleges = await CollegeModel.find({ collegeType: determinedCollegeType });
			return colleges;
		} catch (error) {
			console.error("Error fetching colleges:", error);
			throw new Error("Failed to fetch colleges");
		}
	}
	

	
	
	
	


}

export default UserService;
