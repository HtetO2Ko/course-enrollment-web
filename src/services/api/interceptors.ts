import type { InternalAxiosRequestConfig } from "axios";

import { api } from "./clients";
import { tokenStore } from "./token";
import { renewAccessToken, renewRefreshToken } from "./auth-api";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

api.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshSession(): Promise<string> {
  const currentRefreshToken = tokenStore.getRefreshToken();

  if (!currentRefreshToken) {
    throw new Error("Refresh token not found");
  }

  try {
    const newAccessToken = await renewAccessToken(currentRefreshToken);

    tokenStore.setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message !== "Invalid or expired refresh token") {
      throw error;
    }

    const newRefreshToken = await renewRefreshToken(currentRefreshToken);

    tokenStore.setRefreshToken(newRefreshToken);

    const newAccessToken = await renewAccessToken(newRefreshToken);

    tokenStore.setAccessToken(newAccessToken);

    return newAccessToken;
  }
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message;

    const isExpired =
      error.response?.status === 401 ||
      message === "Session expired: Please authenticate again";

    if (!isExpired || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      tokenStore.clear();

      window.dispatchEvent(new Event("auth:session-expired"));

      return Promise.reject(refreshError);
    }
  },
);
