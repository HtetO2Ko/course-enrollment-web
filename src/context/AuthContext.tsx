import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { tokenStore } from "../services/api/token";
import type { AuthUser } from "../features/auth/types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStoredUser(): AuthUser | null {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    tokenStore.getAccessToken(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    tokenStore.getRefreshToken(),
  );

  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    newUser: AuthUser,
  ) => {
    tokenStore.setTokens({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    localStorage.setItem("user", JSON.stringify(newUser));

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  };

  const logout = () => {
    tokenStore.clear();
    localStorage.removeItem("user");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(accessToken && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
