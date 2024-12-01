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

export { loginDTO, ParameterDTO };
