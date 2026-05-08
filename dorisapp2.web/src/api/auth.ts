import { AxiosError } from "axios"

import api from "@/api/axios"

type AuthResponse = {
  token: string
  email: string
  fullName: string
  role: string
}

type StoredAuthUser = Omit<AuthResponse, "token">

type LoginRequest = {
  email: string
  password: string
}

type RegisterRequest = LoginRequest & {
  fullName: string
}

type ApiErrorBody = {
  message?: string
  title?: string
  errors?: Record<string, string[]>
}

const authStorageKey = "authUser"

async function login(payload: LoginRequest) {
  const { data } = await api.post<AuthResponse>("/Auth/login", payload)
  persistAuth(data)
  return data
}

async function register(payload: RegisterRequest) {
  const { data } = await api.post<AuthResponse>("/Auth/register", payload)
  persistAuth(data)
  return data
}

function persistAuth(auth: AuthResponse) {
  localStorage.setItem("token", auth.token)
  localStorage.setItem(
    authStorageKey,
    JSON.stringify({
      email: auth.email,
      fullName: auth.fullName,
      role: auth.role,
    })
  )
}

function getStoredAuthUser() {
  const authUser = localStorage.getItem(authStorageKey)

  if (!authUser) {
    return null
  }

  try {
    return JSON.parse(authUser) as StoredAuthUser
  } catch {
    return null
  }
}

function isAuthenticated() {
  return Boolean(localStorage.getItem("token"))
}

function isAdmin() {
  return getStoredAuthUser()?.role.toLowerCase() === "admin"
}

function logout() {
  localStorage.removeItem("token")
  localStorage.removeItem(authStorageKey)
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined

    if (data?.message) {
      return data.message
    }

    const firstValidationError = data?.errors
      ? Object.values(data.errors).flat()[0]
      : undefined

    if (firstValidationError) {
      return firstValidationError
    }

    if (data?.title) {
      return data.title
    }
  }

  return "Unable to authenticate. Please check your details and try again."
}

export {
  getAuthErrorMessage,
  getStoredAuthUser,
  isAdmin,
  isAuthenticated,
  login,
  logout,
  register,
}
export type { AuthResponse, LoginRequest, RegisterRequest, StoredAuthUser }
