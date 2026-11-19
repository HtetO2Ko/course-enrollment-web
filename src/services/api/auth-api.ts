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

export const renewAccessToken = async (refreshToken: string) => {
  const { data } = await authApi.post<ApiResponse<AccessTokenData>>(
    "/auth/renew-access-token",
    {
      refreshToken,
    },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message);
  }

  return data.data.accessToken;
};

export const renewRefreshToken = async (refreshToken: string) => {
  const { data } = await authApi.post<ApiResponse<RefreshTokenData>>(
    "/auth/renew-refresh-token",
    {
      refreshToken,
    },
  );

  if (!data.success || !data.data) {
    throw new Error(data.message);
  }

  return data.data.refreshToken;
};
