import { useEffect, useState } from "react";
import {
  getMe,
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
} from "../api/auth.js";
import { AppContext } from "./useAppContext.js";

const AUTH_STORAGE_KEY =
  import.meta.env.VITE_AUTH_STORAGE_KEY || "kms-auth";

const readStoredAuth = () => {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return { user: null };
    }

    const parsedValue = JSON.parse(rawValue);

    return {
      user: parsedValue?.user || null,
    };
  } catch {
    return { user: null };
  }
};

export const AppProvider = ({ children }) => {
  const [authState, setAuthState] = useState(readStoredAuth);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(authState.user));

  const persistAuth = (user) => {
    const nextAuthState = { user };
    setAuthState(nextAuthState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthState));
  };

  const clearAuth = () => {
    setAuthState({ user: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const refreshCurrentUser = async () => {
    setIsAuthLoading(true);

    try {
      const user = await getMe();
      persistAuth(user);
      return user;
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    persistAuth(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    // Do NOT auto-login user after registration
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
    }

    clearAuth();
  };

  useEffect(() => {
    if (!authState.user) {
      setIsAuthLoading(false);
      return;
    }

    refreshCurrentUser().catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: Boolean(authState.user),
        isAuthLoading,
        login,
        register,
        logout,
        refreshCurrentUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
