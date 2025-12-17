import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    access: null,
    refresh: null,
    role: null,
    unique_id: null,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔁 Load tokens on page refresh
  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const role = localStorage.getItem("role");
    const unique_id = localStorage.getItem("unique_id");

    if (access && refresh) {
      setAuth({ access, refresh, role, unique_id });
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  //  LOGIN
  const login = (data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("role", data.role);
    localStorage.setItem("unique_id", data.unique_id);

    setAuth(data);
    setIsAuthenticated(true);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    setAuth({
      access: null,
      refresh: null,
      role: null,
      unique_id: null,
    });
    setIsAuthenticated(false);
  };

  // 🔄 REFRESH ACCESS TOKEN
  const refreshAccessToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/refresh-token/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        setAuth((prev) => ({ ...prev, access: data.access }));
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
