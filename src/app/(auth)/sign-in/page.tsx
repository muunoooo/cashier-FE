"use client";

import { LoginValues } from "@/types/auth";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/api/auth";
import useSession from "@/hooks/useSession";
import { LoginSchema } from "@/lib/schema";
import { toast } from "react-toastify";
import { useState } from "react";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };
  const { setIsAuth, setUser } = useSession();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      const { user, token } = await loginUser(values);

      localStorage.setItem("token", token);
      setIsAuth(true);
      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        toast.error(err.response.data.message || "Something went wrong.");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="h-screen flex flex-col lg:flex-row bg-blue-300 text-white">
      {/* Bagian Kiri - Background Gambar (Hidden di Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-400">
        <Image
          src="/homepage.jpeg"
          alt="Login background"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

      {/* Bagian Kanan - Form Login (Full-Screen di Mobile) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 shadow-lg rounded-lg h-screen">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Please enter your email and password to log in.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="text"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full px-4 py-2 border text-white bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
