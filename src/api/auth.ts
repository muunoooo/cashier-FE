import { RegisterValues } from "@/types/auth";
import { RegisterResponse } from "@/types/register";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

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

export async function registerUser(
  values: RegisterValues
): Promise<RegisterResponse> {
  try {
    const res = await axios.post<RegisterResponse>(
      `${base_url}/auth/register`,
      values,
      getAuthHeader()
    );

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errorMessage =
        err.response?.data?.message || "Registration failed.";

      if (err.response?.status === 400) {
        if (errorMessage.toLowerCase().includes("email")) {
          toast.error("Email is already in use. Please use a different one.");
        } else {
          toast.error(errorMessage);
        }
      } else if (err.response?.status === 500) {
        toast.error("Server error occurred. Please try again later.");
      } else {
        toast.error("An error occurred during registration.");
      }
    } else {
      toast.error("An unexpected error occurred.");
    }

    console.error("Registration failed:", err);
    throw err;
  }
}

export const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `${base_url}/user/profile`,
      getAuthHeader()
    );
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
