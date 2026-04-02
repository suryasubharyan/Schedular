import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Load user from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      setUser({ token, userId });
    }
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("linkedInName", userData.name);
    localStorage.setItem("linkedInEmail", userData.email);

    setUser({
      token,
      userId: userData.id,
      name: userData.name,
      email: userData.email,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};