
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const tokenStore = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem("accessToken", token);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem("refreshToken", token);
  },

  setTokens: (tokens: Tokens): void => {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  clear: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};
