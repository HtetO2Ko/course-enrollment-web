import axios from "axios";
import { publicApi } from "../../../services/api/clients";
import type { ApiResponse } from "../../batches/types/batch.types";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  phone: string;
  fullname: string;
  password: string;
  role: "ADMIN" | "USER";
}

export interface AuthUser {
  fullname: string;
  username: string;
  role: "ADMIN" | "USER";
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
  error: null | string;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await publicApi.post<AuthResponse>("/auth/login", payload);

  if (!data.success) {
    throw new Error(data.message || "Login failed");
  }

  return data.data;
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const { data } = await publicApi.post<ApiResponse<null>>(
      "/auth/register",
      payload,
    );

    if (!data.success) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ApiResponse<null>>(error)) {
      throw new Error(error.response?.data?.message || "Registration failed", { cause: error });
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Something went wrong", { cause: error });
  }
}
