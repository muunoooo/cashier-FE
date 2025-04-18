// "use client";

// import { IUser } from "@/types/user";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

// const useSession = () => {
//   const [isAuth, setIsAuth] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [user, setUser] = useState<IUser | null>(null);

//   useEffect(() => {
//     const checkSession = async () => {
//       const token = localStorage.getItem("token");
//       console.log("Token from localStorage:", token);

//       if (!token) {
//         setIsAuth(false);
//         setUser(null);
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const { data } = await axios.get(`${base_url}/user/profile`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Backend response:", data);

//         if (data?.user) {
//           setUser(data.user);
//           setIsAuth(true);
//         } else {
//           setIsAuth(false);
//           setUser(null);
//         }
//       } catch (err) {
//         console.error("❌ Session check failed:", err);
//         setIsAuth(false);
//         setUser(null);
//         localStorage.removeItem("token");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkSession();

//     return () => {
//       setIsAuth(false);
//       setIsLoading(false);
//       setUser(null);
//     };
//   }, []);

//   return { user, isAuth, isLoading, setIsAuth, setUser, setIsLoading };
// };

// export default useSession;
