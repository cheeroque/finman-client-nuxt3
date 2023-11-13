export interface AuthPlugin {
  login: (credentials: LoginCredentials) => void
  logout: () => void
  getToken: (refresh?: boolean) => string
  setToken: (token?: string) => void
  reset: () => void
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponseData {
  login: LoginOutput
}

export interface LoginOutput {
  access_token: string
  refresh_token?: string
  user: User
}

export interface Me {
  me: User
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at?: string
}
