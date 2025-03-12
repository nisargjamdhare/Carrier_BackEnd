interface ParameterDTO {
	name: string;
	email: string;
	password: string;
	mobileNumer: number;
}

interface loginDTO {
	email: string;
	password: string;
}

interface UserResponse {
	name: string;
	email: string;
}
interface FormResponse {
	question: string;
	answer: string;
  }
  
  interface ModelRequest{
	formResponses: FormResponse[];
	recording: string;
  }

  interface RequestDTO {

	careerFields: [
		{
		  field: { type: String},
		  reason: { type: String },
		}
	]
  }


export { loginDTO, ParameterDTO, UserResponse, ModelRequest, RequestDTO };
