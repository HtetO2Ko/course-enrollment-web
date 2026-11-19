let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,

  setAccessToken: (token: string) => {
    accessToken = token;
  },

  setRefreshToken: (token: string) => {
    refreshToken = token;
  },

  setTokens: (tokens: { accessToken: string; refreshToken: string }) => {
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  },

  clear: () => {
    accessToken = null;
    refreshToken = null;
  },
};
