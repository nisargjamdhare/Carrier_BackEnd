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

export { loginDTO, ParameterDTO, UserResponse };
