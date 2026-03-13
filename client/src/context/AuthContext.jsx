import { useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { isTokenExpired } from "../utils/jwt";
import {
  clearStoredUser,
  loadStoredUser,
  saveStoredUser,
} from "../utils/storage";
import { AuthContext } from "./AuthContextInstance";

const getInitialUser = () => {
  const user = loadStoredUser();
  if (!user?.token || isTokenExpired(user.token)) {
    clearStoredUser();
    return null;
  }

  return user;
};

export const AuthProvider = ({ children }) => {
  const [initialUser] = useState(() => getInitialUser());
  const [user, setUser] = useState(initialUser);
  const [bootstrapping, setBootstrapping] = useState(Boolean(initialUser));

  useEffect(() => {
    const handleExpired = () => setUser(null);
    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired);
  }, []);

  useEffect(() => {
    let active = true;
    const initialToken = initialUser?.token;

    const syncProfile = async () => {
      if (!initialToken) {
        setBootstrapping(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (!active) return;
        const nextUser = { ...initialUser, ...profile };
        setUser(nextUser);
        saveStoredUser(nextUser);
      } catch {
        if (!active) return;
        clearStoredUser();
        setUser(null);
      } finally {
        if (active) setBootstrapping(false);
      }
    };

    syncProfile();

    return () => {
      active = false;
    };
  }, [initialUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      login: (nextUser) => {
        saveStoredUser(nextUser);
        setUser(nextUser);
      },
      logout: () => {
        clearStoredUser();
        setUser(null);
      },
      updateUser: (updates) => {
        const nextUser = { ...user, ...updates };
        saveStoredUser(nextUser);
        setUser(nextUser);
      },
    }),
    [bootstrapping, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
