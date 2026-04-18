import { createContext, useEffect, useState } from "react";
import {
  logoutApi,
  updateProfile as updateProfileApi,
  verifyToken,
} from "../api/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const res = await verifyToken();
        setUser({
          ...res.data.user,
          token,
        });
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    };

    restoreSession();
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);

    setUser({
      ...userData,
      token,
    });
  };

  const updateUser = async (payload) => {
    const res = await updateProfileApi(payload);
    const token = localStorage.getItem("token");

    setUser((prevUser) => ({
      ...prevUser,
      ...res.data.user,
      token,
    }));

    return res;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Local cleanup should still happen if the API is unavailable.
    }

    localStorage.removeItem("token");
    localStorage.removeItem("linkedinUserId");
    localStorage.removeItem("profileName");
    localStorage.removeItem("profileHeadline");
    localStorage.removeItem("profilePicture");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authReady,
        loginUser,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
