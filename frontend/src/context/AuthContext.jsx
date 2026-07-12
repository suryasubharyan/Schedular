import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  logoutApi,
  updateProfile as updateProfileApi,
  verifyToken,
  login as loginApi,
  register as registerApi,
  googleLogin as googleLoginApi,
} from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyToken();
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password });
    setUser(res.data.user);
    return res;
  }, []);

  const register = useCallback(async (email, password, name) => {
    const res = await registerApi({ email, password, name });
    return res;
  }, []);

  const googleLogin = useCallback(async (credential) => {
    const res = await googleLoginApi(credential);
    setUser(res.data.user);
    return res;
  }, []);

  const updateUser = useCallback(async (payload) => {
    const res = await updateProfileApi(payload);
    setUser((prevUser) => ({
      ...prevUser,
      ...res.data.user,
    }));
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Local cleanup should still happen if the API is unavailable.
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      authReady,
      login,
      register,
      googleLogin,
      updateUser,
      logout,
    }),
    [user, authReady, login, register, googleLogin, updateUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
