import { AxiosError } from "axios"

import api from "@/api/axios"

type AuthResponse = {
  email: string
  fullName: string
  role: string
}

type StoredAuthUser = AuthResponse

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

let authUser: StoredAuthUser | null = null
let profileRequest: Promise<StoredAuthUser | null> | null = null

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

async function logout() {
  clearAuthState()

  try {
    await api.post("/Auth/logout")
  } catch {
    // Local auth state is already cleared; 
    // logout should not be blocked by an expired cookie.
  }
}

async function loadCurrentUser() {
  profileRequest ??= api
    .get<StoredAuthUser>("/Profile/me")
    .then(({ data }) => {
      authUser = {
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      }

      return authUser
    })
    .catch(() => {
      clearAuthState()
      return null
    })
    .finally(() => {
      profileRequest = null
    })

  return profileRequest
}

function persistAuth(auth: AuthResponse) {
  authUser = {
    email: auth.email,
    fullName: auth.fullName,
    role: auth.role,
  }
}

function clearAuthState() {
  authUser = null
}

function getStoredAuthUser() {
  return authUser
}

function isAuthenticated() {
  return Boolean(authUser)
}

function isAdmin() {
  return authUser?.role?.toLowerCase() === "admin"
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
  clearAuthState,
  getAuthErrorMessage,
  getStoredAuthUser,
  isAdmin,
  isAuthenticated,
  loadCurrentUser,
  login,
  logout,
  register,
}
export type { AuthResponse, LoginRequest, RegisterRequest, StoredAuthUser }
