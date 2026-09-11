import axios from "axios";
import { getIdToken } from "./firebaseAuth";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Inject the Firebase ID token on every request.
 * Firebase automatically refreshes it before it expires (1 hour window),
 * so no manual refresh interceptor is needed — unlike the old JWT approach.
 */
api.interceptors.request.use(async (config) => {
  try {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // No user signed in — request goes through without auth header
  }
  return config;
});

/**
 * On 401, redirect to login — Firebase handles token refresh transparently
 * via getIdToken(), so a 401 means the session is truly invalid/expired.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
