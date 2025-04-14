import { RegisterValues } from "@/types/auth";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

export async function registerUser(values: RegisterValues): Promise<any> {
  try {
    const res = await axios.post(`${base_url}/auth/register`, values);
    toast.success("Registration successful!");
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";

      if (err.response?.status === 400) {
        if (errorMessage.toLowerCase().includes("email")) {
          toast.error("Email is already in use. Please use another email.");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error(errorMessage);
      }
    } else {
      toast.error("An unexpected error occurred.");
    }

    console.error("Registration failed:", err);
    throw err;
  }
}

export async function loginUser(values: { email: string; password: string }) {
  try {
    const payload = { email: values.email, password: values.password };
    const res = await axios.post(`${base_url}/auth/login`, payload);

    localStorage.setItem("token", res.data.token);

    toast.success("Login successful!");
    return res.data;
  } catch (err: unknown) {
    console.error("Login failed", err);

    throw err;
  }
}
