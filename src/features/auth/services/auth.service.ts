import { authApi } from "../../../services/api/clients";
import type { AuthResponse, AuthData } from "../types/auth.types";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  phone: string;
  fullname: string;
  password: string;
  role: "USER";
}

export const loginUser = async (payload: LoginPayload): Promise<AuthData> => {
  const { data } = await authApi.post<AuthResponse>("/auth/login", payload);

  if (!data.success || !data.data) {
    throw new Error(data.message || "Login failed.");
  }

  return data.data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthData> => {
  const { data } = await authApi.post<AuthResponse>("/auth/register", payload);

  if (!data.success || !data.data) {
    throw new Error(data.message || "Registration failed.");
  }

  return data.data;
};
