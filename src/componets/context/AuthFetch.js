import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useAuthFetch = () => {
  const { auth, refreshAccessToken, logout } = useAuth(); // Assuming you have a logout function in your context
  const navigate = useNavigate();

  const authFetch = async (url, options = {}) => {
    // Initial check: if user is not authenticated at all, redirect immediately.
    if (!auth || !auth.access) {
      console.error("User is not authenticated. Redirecting to login page.");
      navigate('/Login');
      // Return a rejected promise to stop execution
      return Promise.reject(new Error("User not authenticated"));
    }

    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.access}`,
        // IMPORTANT: Don't set Content-Type here if you're sending FormData.
        // The browser will set it automatically with the correct boundary.
        // We'll only set it for non-FormData requests.
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      },
    });

    // If token expired (401 Unauthorized), try to refresh it
    if (response.status === 401) {
      console.warn("Access token has expired. Attempting to refresh...");
      const newAccess = await refreshAccessToken();

      // If refreshing token fails (e.g., refresh token is also expired)
      if (!newAccess) {
        console.error("Session expired. Could not refresh token. Redirecting to login page.");
        
        // Optional: Call a logout function to clear user data from context/storage
        if (logout) {
          logout();
        }
        
        // Redirect to the login page
        navigate('/Login');
        
        // Return a rejected promise to ensure the calling component's catch block is triggered
        return Promise.reject(new Error("Session expired. Please log in again."));
      }

      // If refresh was successful, retry the original request with the new token
      console.log("Token refreshed successfully. Retrying the original request.");
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccess}`,
          ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        },
      });
    }

    return response;
  };

  return authFetch;
};