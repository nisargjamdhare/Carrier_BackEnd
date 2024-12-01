import { ParameterDTO, loginDTO } from "../DTO/UserDto";
interface IUserService {
	registerUser(body: ParameterDTO): Promise<String>;
	loginUser(body: loginDTO): Promise<string>;
}

export default IUserService;
