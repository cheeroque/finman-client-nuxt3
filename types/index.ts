import { ConcreteComponent } from 'vue'

export {}

declare global {
  type ControlSize = 'md' | 'lg' | null
  type ControlState = boolean | null

  type DialogSize = 'sm' | 'md' | 'lg' | null

  type DrawerAction = {
    key: string
    component: ConcreteComponent | string
  }

  type DrawerPage = {
    key: string
    link: string
  }

  type LoginCredentials = {
    name: string
    password: string
  }

  type LoginResponse = {
    access_token: string
    user: User
  }

  type RecordsCategory = {
    id: number
    name: string
    slug: string
    is_income: 0 | 1
    created_at?: string
    updated_at?: string
    color?: string
  }

  type User = {
    id: number
    name: string
    email: string
    email_verified_at?: string
    created_at?: string
    updated_at?: string
  }
}
