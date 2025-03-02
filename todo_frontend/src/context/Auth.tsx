import React, { createContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/auth";

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = async (username: string, password: string) => {
    const authData = await apiLogin(username, password);
    setToken(authData.token);
  };

  const logout = () => {
    apiLogout();
    setToken(null);
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};
