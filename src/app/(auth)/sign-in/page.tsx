"use client";

import { LoginValues } from "@/types/auth";
import { Formik, Form, FormikHelpers } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "@/api/auth";
import { LoginSchema } from "@/lib/schema";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useSession } from "@/contexts/SessionContext";
import Loading from "@/components/loading";
import { FloatingInput } from "@/components/FloatingInput";
import { FloatingPasswordInput } from "@/components/FloatingPasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const { isAuth, setIsAuth, setUser, token } = useSession();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoadingAfterLogin, setIsLoadingAfterLogin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      router.push("/dashboard");
    } else {
      setIsLoadingAfterLogin(false);
    }
  }, [isAuth, token, router]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setInitialValues((prev) => ({
        ...prev,
        email: savedEmail,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (
    values: LoginValues,
    { setSubmitting }: FormikHelpers<LoginValues>
  ) => {
    try {
      const { user, token } = await loginUser(values);

      localStorage.setItem("token", token);
      setIsAuth(true);
      setUser(user);

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      setIsLoadingAfterLogin(true);

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
    <>
      {isLoadingAfterLogin && <Loading />}
      <div className="h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#FFA55D] to-[#FFDF88] text-white">
        <div className="hidden lg:flex lg:w-1/2 relative">
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="h-[516px] w-[448px] rounded-lg overflow-hidden relative">
              <Image
                src="/homepage.jpeg"
                alt="Homepage"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 448px"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 rounded-lg h-screen">
          <div className="w-full max-w-md bg-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Welcome Back Mister Cashier! 🐻
            </h2>
            <h2 className="text-lg text-gray-600 mb-6 text-center">
              Ready to provide excellent service to our customers?
            </h2>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <FloatingInput
                    name="email"
                    label="Email"
                    type="email"
                    required
                  />

                  <FloatingPasswordInput
                    name="password"
                    label="Password"
                    required
                  />

                  <div className="flex items-center mb-6">
                    <label
                      htmlFor="rememberMe"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />

                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${
                            rememberMe ? "bg-[#00A1E5]" : "bg-gray-300"
                          }`}
                        />

                        <div
                          className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                            rememberMe ? "translate-x-4" : ""
                          }`}
                        />
                      </div>
                      <span className="ml-3 text-sm text-gray-700 font-medium">
                        Remember Me
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#A76545] text-white py-2 rounded-lg hover:bg-yellow-900 transition duration-200"
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
    </>
  );
}
