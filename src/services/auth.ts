import api from "./api"

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password })

  return res.data
}

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password })

  return res.data
}

export const getMyDetails = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const getAllUsers = async (page:number , limit:number) => {
  const res = await api.get(`/auth/users?page=${page}&limit=${limit}`)
  return res.data;
}

export const refreshTokens = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    refreshToken: refreshToken
  })
  return res.data
}
