import axios, { AxiosError } from "axios";
import { refreshTokens } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/google-login",
  "/auth/admin-login",
  "/trip",
  "/trip/all",
  "/review",
];

// Refresh queue to prevent concurrent duplicate refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // If 7-day session has expired, cleanly clear credentials
    const expiresAt = localStorage.getItem("authExpiresAt");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authExpiresAt");
    }

    const token = localStorage.getItem("accessToken");
    const requestUrl = config.url || "";
    const isPublic = PUBLIC_ENDPOINTS.some(
      (url) => requestUrl === url || requestUrl === url.slice(1)
    );

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

    // Check if the endpoint is public
    const requestUrl = originalRequest?.url || "";
    const isPublic = PUBLIC_ENDPOINTS.some(
      (url) => requestUrl === url || requestUrl === url.slice(1)
    );

    // If 401 on a public endpoint, or request has already been retried, reject immediately
    if (isPublic || originalRequest?._retry) {
      return Promise.reject(error);
    }

    // Check if user is actually logged in (has a refresh token)
    const refreshToken = localStorage.getItem("refreshToken");

    // If no refresh token exists, the user is unauthenticated / guest — DO NOT attempt refresh or spam toasts
    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("authExpiresAt");
      return Promise.reject(error);
    }

    // Check if 7-day session has expired
    const expiresAt = localStorage.getItem("authExpiresAt");
    if (expiresAt && Date.now() > parseInt(expiresAt, 10)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authExpiresAt");
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // If a refresh is already in progress, queue this request until completed
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Perform silent background refresh (NO disruptive UI loading toasts)
        const data = await refreshTokens(refreshToken);
        const newAccessToken = data?.data?.accessToken || data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
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

        processQueue(null, newAccessToken);

        // Retry original request with newly issued access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authExpiresAt");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
