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
				  collegeName: "All India Institute of Medical Sciences (AIIMS), Delhi",
				  collegeLocation: "Delhi",
				  collegeFees: 0,
				  Rank: 1,
				  officialWebsite: "https://www.aiims.edu/"
				},
				{
				  collegeName: "Post Graduate Institute of Medical Education and Research (PGIMER), Chandigarh",
				  collegeLocation: "Chandigarh",
				  collegeFees: 0,
				  Rank: 2,
				  officialWebsite: "https://pgimer.edu.in/"
				},
				{
				  collegeName: "Christian Medical College (CMC), Vellore",
				  collegeLocation: "Tamil Nadu",
				  collegeFees: 300000,
				  Rank: 3,
				  officialWebsite: "https://www.cmcvellore.ac.in/"
				},
				{
				  collegeName: "National Institute of Mental Health & Neuro Sciences (NIMHANS), Bengaluru",
				  collegeLocation: "Karnataka",
				  collegeFees: 0,
				  Rank: 4,
				  officialWebsite: "https://nimhans.ac.in/"
				},
				{
				  collegeName: "Jawaharlal Institute of Postgraduate Medical Education and Research (JIPMER), Puducherry",
				  collegeLocation: "Puducherry",
				  collegeFees: 0,
				  Rank: 5,
				  officialWebsite: "https://jipmer.edu.in/"
				},
				{
				  collegeName: "Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS), Lucknow",
				  collegeLocation: "Uttar Pradesh",
				  collegeFees: 0,
				  Rank: 6,
				  officialWebsite: "https://www.sgpgi.ac.in/"
				},
				{
				  collegeName: "Banaras Hindu University (BHU), Varanasi",
				  collegeLocation: "Uttar Pradesh",
				  collegeFees: 0,
				  Rank: 7,
				  officialWebsite: "https://www.bhu.ac.in/"
				},
				{
				  collegeName: "Amrita Vishwa Vidyapeetham, Coimbatore",
				  collegeLocation: "Tamil Nadu",
				  collegeFees: 560000,
				  Rank: 8,
				  officialWebsite: "https://www.amrita.edu/"
				},
				{
				  collegeName: "Kasturba Medical College (KMC), Manipal",
				  collegeLocation: "Karnataka",
				  collegeFees: 560000,
				  Rank: 9,
				  officialWebsite: "https://manipal.edu/kmc-manipal.html"
				},
				{
				  collegeName: "Madras Medical College & Government General Hospital, Chennai",
				  collegeLocation: "Tamil Nadu",
				  collegeFees: 0,
				  Rank: 10,
				  officialWebsite: "https://www.mmc.ac.in/"
				},
				{
				  collegeName: "Armed Forces Medical College (AFMC), Pune",
				  collegeLocation: "Pune",
				  collegeFees: 72690,
				  Rank: null,
				  officialWebsite: "https://afmc.nic.in/"
				},
				{
				  collegeName: "Grant Medical College, Mumbai",
				  collegeLocation: "Mumbai",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.gmcjjh.org/"
				},
				{
				  collegeName: "Seth Gordhandas Sunderdas Medical College, Mumbai",
				  collegeLocation: "Mumbai",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.kem.edu/"
				},
				{
				  collegeName: "BJ Government Medical College, Pune",
				  collegeLocation: "Pune",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.bjmcpune.org/"
				},
				{
				  collegeName: "Indira Gandhi Government Medical College, Nagpur",
				  collegeLocation: "Nagpur",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.igmcnagpur.org/"
				},
				{
				  collegeName: "Rajiv Gandhi Medical College, Thane",
				  collegeLocation: "Thane",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.rgmc-thane.com/"
				},
				{
				  collegeName: "Government Medical College, Aurangabad",
				  collegeLocation: "Aurangabad",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.gmcaurangabad.com/"
				},
				{
				  collegeName: "Government Medical College, Latur",
				  collegeLocation: "Latur",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.gmclatur.org/"
				},
				{
				  collegeName: "Government Medical College, Miraj",
				  collegeLocation: "Miraj",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.gmc-miraj.com/"
				},
				{
				  collegeName: "Government Medical College, Akola",
				  collegeLocation: "Akola",
				  collegeFees: 138300,
				  Rank: null,
				  officialWebsite: "https://www.gmca-kola.org/"
				}
			  ];
			const colleges = college_data.map((entry) => ({
				collegeName: entry["collegeName"],
				collegeLocation: entry["collegeLocation"],
				collegeFees: isNaN(Number(entry["collegeFees"])) ? null : Number(entry["collegeFees"]),
				Rank: entry["Rank"] ? Number(entry["Rank"]) : null,
				officialWebsite: entry["officialWebsite"] || null,
				collegeType: "Medical",
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
    "Doctor",
    "Nursing",
    "Pharmacy",
    "Dentistry",
    "Physiotherapy",
    "Radiology & Medical Imaging",
    "Veterinary Science",
    "Biomedical Science & Biotechnology",
    "Public Health Administration",
    "Healthcare Management",
    "Nutrition & Dietetics",
    "Psychology & Mental Health Counseling",
    "Occupational Therapy",
    "Genetic Counseling",
    "Paramedical Sciences (Lab Technician, EMT, etc.)",
    "Medical Equipment & Device Engineering",
    "Forensic Science & Pathology",
    "Epidemiology",
    "Health Informatics",
	"Patient Care Technician",
	"Healthcare Support Occupations",
    "Medical Research Scientist",
    "Actuarial Science (as it deals with risk assessment in medical insurance)",
    "Statistician (for medical research and data analysis)",
    "Research Scientist (for medical and life sciences)",
    "Operations Research Analyst (for hospital and healthcare management)",
    
    // Expanded fields from the search results
    "Anesthesiology (Anesthesiologist, Nurse Anesthetist)",
    "Cardiology (Cardiologist, Cardiovascular Technologist)",
    "Critical Care Medicine (Intensivist, Critical Care Nurse)",
    "Dermatology (Dermatologist)",
    "Emergency Medicine (Emergency Physician, EMT)",
    "Endocrinology (Endocrinologist)",
    "Gastroenterology (Gastroenterologist)",
    "Genetics (Genetic Counselor)",
    "Geriatrics (Geriatrician)",
    "Hematology (Hematologist, Medical Laboratory Technician)",
    "Nephrology (Nephrologist, Dialysis Technician)",
    "Neurology (Neurologist, Neuropsychologist)",
    "Oncology (Oncologist, Radiation Therapist)",
    "Ophthalmology (Ophthalmologist, Optometrist)",
    "Orthopedics (Orthopedic Physician, Physical Therapist)",
    "Pediatrics (Pediatrician, Neonatal Nurse Practitioner)",
    "Psychiatry (Psychiatrist, Psychiatric Nurse Practitioner)",
    "Pulmonology (Pulmonologist, Respiratory Therapist)",
    "Reproductive Medicine (Obstetrician, Gynecologist)",
    "Surgery (General Surgeon, Neurosurgeon)"
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
