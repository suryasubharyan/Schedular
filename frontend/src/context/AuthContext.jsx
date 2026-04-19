import { createContext, useEffect, useState } from "react";
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

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    setUser(res.data.user);
    return res;
  };

  const register = async (email, password, name) => {
    const res = await registerApi({ email, password, name });
    return res;
  };

  const googleLogin = async (credential) => {
    const res = await googleLoginApi(credential);
    setUser(res.data.user);
    return res;
  };

  const updateUser = async (payload) => {
    const res = await updateProfileApi(payload);
    setUser((prevUser) => ({
      ...prevUser,
      ...res.data.user,
    }));
    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Local cleanup should still happen if the API is unavailable.
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        login,
        register,
        googleLogin,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
