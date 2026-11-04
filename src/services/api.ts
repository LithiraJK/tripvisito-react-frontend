import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/google-login", "/auth/admin-login", "/trip"];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Check if 7-day session has expired
    const expiresAt = localStorage.getItem("authExpiresAt");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authExpiresAt");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired after 7 days"));
    }

    const token = localStorage.getItem("accessToken");
    // Check if the URL exactly matches or starts with public endpoints
    const isPublic = PUBLIC_ENDPOINTS.some((url) => {
      const requestUrl = config.url || '';
      return requestUrl === url || requestUrl === url.slice(1);
    });

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isProtected = !PUBLIC_ENDPOINTS.some((url) => {
      const requestUrl = originalRequest?.url || '';
      return requestUrl === url || requestUrl === url.slice(1);
    });

    // Check if 7-day session has expired before trying refresh
    const expiresAt = localStorage.getItem("authExpiresAt");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authExpiresAt");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired after 7 days"));
    }

    if (
      error.response?.status === 401 &&
      isProtected &&
      !originalRequest._retry
    ) {
      console.log("🔄 401 detected - Attempting token refresh...");
      originalRequest._retry = true;

      const toastId = toast.loading("Refreshing session...");

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          toast.dismiss(toastId);
          window.location.href = "/login";
          throw new Error("No refresh token available");
        }

        const data = await refreshTokens(refreshToken);
        const newAccessToken = data?.data?.accessToken || data?.accessToken;

        if (!newAccessToken) {
          throw new Error("Failed to retrieve new access token");
        }

        localStorage.setItem("accessToken", newAccessToken);
        if (data?.data?.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
        if (data?.data?.expiresAt) {
          const expMs = new Date(data.data.expiresAt).getTime();
          if (!isNaN(expMs)) {
            localStorage.setItem("authExpiresAt", String(expMs));
          }
        }

        toast.dismiss(toastId);
        console.log("✅ Token refresh successful");

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log("🔄 Retrying original request...");
        return api(originalRequest);
      } catch (refreshErr) {
        toast.dismiss(toastId);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authExpiresAt");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
