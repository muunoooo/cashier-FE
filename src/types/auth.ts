export interface RegisterValues {
  name: string;
  email: string;
  password: string;
}
export interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export interface LoginResponse {
  message: string;
  customer: {
    id: number;
    fullName: string;
    email: string;
    password: string;
    isVerify: boolean;
    role: string;
    avatar: string | null;
    createdAt: string;
    isDelete: boolean;
  };
  token: string;
}

export interface LoginValues {
  email: string;
  password: string;
}

export const LoginValues = {
  email: "",
  password: "",
};
