export interface AuthPlugin {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  getToken: (refresh?: boolean) => string
  setToken: (token?: string) => void
  reset: () => void
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at?: string
}
