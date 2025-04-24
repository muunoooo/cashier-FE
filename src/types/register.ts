import { IUser } from "./user";

export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: IUser;
}
