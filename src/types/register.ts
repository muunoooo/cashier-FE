import { IUser } from "./user";

// Definisikan tipe untuk RegisterValues
export interface RegisterValues {
    name: string;
    email: string;
    password: string;
  }
  
  // Tipe untuk respons API setelah pendaftaran (disesuaikan dengan respons API Anda)
  export interface RegisterResponse {
    success: boolean;
    message: string;
    user?: IUser;  // Menambahkan user jika ada dalam respons
  }