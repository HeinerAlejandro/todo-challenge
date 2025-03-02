import { apiClient, setAuthToken } from "./client";
import { AuthResponse, User, UserResponse } from "../models/auth.model";

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/get-token/", { username, password });
  setAuthToken(response.data.token);
  return response.data;
};

export const register = async (user: User): Promise<boolean> => {
  try {
    const response = await apiClient.post<UserResponse>("/auth/register-user/", user);
    if (response.status == 201)
      return true
     
  } catch (error: any) {
    throw error.response?.data || { error: "Error inesperado" };
  }
  return false
};
export const logout = () => {
  setAuthToken(null);
};