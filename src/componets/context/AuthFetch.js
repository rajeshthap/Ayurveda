import { useAuth } from "../context/AuthContext";

export const useAuthFetch = () => {
  const { auth, refreshAccessToken } = useAuth();

  const authFetch = async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${auth.access}`,
        "Content-Type": "application/json",
      },
    });

    //  If token expired → refresh
    if (response.status === 401) {
      const newAccess = await refreshAccessToken();

      if (!newAccess) throw new Error("Session expired");

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
