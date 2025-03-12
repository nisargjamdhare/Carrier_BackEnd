import { ParameterDTO, loginDTO, UserResponse } from "../DTO/UserDto";
interface IUserService {
	registerUser(body: ParameterDTO): Promise<String>;
	loginUser(body: loginDTO): Promise<UserResponse | string>;
	insertCollegesFromExcel(body : any): Promise<any>;	
}

export default IUserService;
