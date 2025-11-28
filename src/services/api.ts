import axios, { AxiosError } from "axios"
import { refreshTokens } from "./auth";
import toast from "react-hot-toast";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"];

// Request interceptor
api.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem("accessToken")

  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
},
(error) => Promise.reject(error)
)


// Response interceptor 
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    if (
      error.response?.status === 401 &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      console.log("🔄 401 Error detected - Attempting token refresh...")
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          window.location.href = "/login"
          throw new Error("No refresh token available")
        }

        console.log("🔑 Refreshing tokens...")
        toast.loading("Refreshing session...")
        const data = await refreshTokens(refreshToken)
        console.log("✅ Token refresh successful")
        
        localStorage.setItem("accessToken", data.accessToken)
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken)
        }

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        console.log("🔄 Retrying original request...")
        return api(originalRequest)
      } catch (refreshErr) {
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("accessToken")
        window.location.href = "/login"
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  }
)

export default api;