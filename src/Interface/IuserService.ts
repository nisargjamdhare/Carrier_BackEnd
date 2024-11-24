import { IUser } from "../DTO/UserDto";

export interface IUserService {
  registerUser(user: IUser): Promise<IUser>;
  loginUser(email: string, password: string): Promise<IUser | null>;
}
