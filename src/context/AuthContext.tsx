import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { tokenStore } from "../services/api/token";
import type { AuthUser } from "../features/auth/types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  updateUser: (updatedUser: Partial<AuthUser>) => void;
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
  const queryClient = useQueryClient();

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    tokenStore.getAccessToken(),
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    tokenStore.getRefreshToken(),
  );

  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  // Login
  const login = useCallback(
    (newAccessToken: string, newRefreshToken: string, newUser: AuthUser) => {
      // Clear previous account's cached data.
      queryClient.clear();

      tokenStore.setTokens({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });

      localStorage.setItem("user", JSON.stringify(newUser));

      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(newUser);
    },
    [queryClient],
  );

  // Update authenticated user information
  const updateUser = useCallback((updatedUser: Partial<AuthUser>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const newUser: AuthUser = {
        ...currentUser,
        ...updatedUser,
      };

      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    });
  }, []);

  // Logout
  const logout = useCallback(() => {
    // Clear all cached queries and mutations.
    queryClient.clear();

    tokenStore.clear();
    localStorage.removeItem("user");

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, [queryClient]);

  // Handle expired sessions
  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(accessToken && user),
        login,
        updateUser,
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
