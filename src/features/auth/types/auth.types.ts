export interface AuthUser {
  userid: string;
  username: string;
  fullname: string;
  role: "ADMIN" | "USER";
  phone?: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
  error: unknown;
}
