"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { IUser } from "@/types/user";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;



interface SessionContextProps {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: IUser | null) => void;
  setIsAuth: (auth: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken); // Simpan token di context

    axios
      .get(`${base_url}/user/profile`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuth(true);
      })
      .catch((err) => {
        console.error("❌ Session check failed:", err);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuth(false);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user,
        isAuth,
        isLoading,
        token,
        setUser,
        setIsAuth,
        setIsLoading,
        setToken,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
