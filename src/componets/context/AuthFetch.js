import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthFetch = () => {
  const { auth, refreshAccessToken } = useAuth();
  const navigate = useNavigate();

  const authFetch = async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
    });

    // If token expired → refresh
    if (response.status === 401) {
      const newAccess = await refreshAccessToken();

      // If refreshing token fails (session expired), redirect to login
      if (!newAccess) {
        navigate('/Login'); // Redirect to the login page
        return; // Stop further execution
      }

      // Retry the request with the new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccess}`,
          "Content-Type": "application/json",
        },
      });
    }

    return response;
  };

  return authFetch;
};