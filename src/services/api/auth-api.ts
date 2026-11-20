import { authApi } from "./clients";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: unknown;
}

interface AccessTokenData {
  accessToken: string;
}

interface RefreshTokenData {
  refreshToken: string;
}

export const renewAccessToken = async (
  refreshToken: string,
): Promise<string> => {
  const { data } = await authApi.post<ApiResponse<AccessTokenData>>(
    "/auth/renew-access-token",
    { refreshToken },
  );

  if (!data.success || !data.data?.accessToken) {
    throw new Error(data.message || "Failed to renew access token");
  }

  return data.data.accessToken;
};

export const renewRefreshToken = async (
  refreshToken: string,
): Promise<string> => {
  const { data } = await authApi.post<ApiResponse<RefreshTokenData>>(
    "/auth/renew-refresh-token",
    { refreshToken },
  );

  if (!data.success || !data.data?.refreshToken) {
    throw new Error(data.message || "Failed to renew refresh token");
  }

  return data.data.refreshToken;
};
