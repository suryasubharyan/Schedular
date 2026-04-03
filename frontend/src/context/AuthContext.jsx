import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  const appUserId = localStorage.getItem("appUserId");
  const name = localStorage.getItem("appUserName");
  const email = localStorage.getItem("appUserEmail");

  if (token && appUserId) {
    setUser({
      token,
      userId: appUserId,
      name,
      email,
    });
  }
}, []);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("appUserId", userData.id);
    localStorage.setItem("appUserName", userData.name || "");
    localStorage.setItem("appUserEmail", userData.email || "");

    setUser({
      token,
      userId: userData.id,
      name: userData.name,
      email: userData.email,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("appUserId");
    localStorage.removeItem("appUserName");
    localStorage.removeItem("appUserEmail");

    localStorage.removeItem("linkedinUserId");
    localStorage.removeItem("profileName");
    localStorage.removeItem("profileHeadline");
    localStorage.removeItem("profilePicture");

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};