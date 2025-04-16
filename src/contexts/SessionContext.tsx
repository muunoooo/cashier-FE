"use client"

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_BASE_URL_BE;

interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface SessionContextProps {
  user: IUser | null;
  isAuth: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setIsAuth: (auth: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    axios
      .get(`${base_url}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
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
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SessionContext.Provider
      value={{ user, isAuth, isLoading, setUser, setIsAuth, setIsLoading }}
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
