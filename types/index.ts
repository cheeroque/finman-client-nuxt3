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
    color?: string
    created_at: string
    id: number
    is_income: 0 | 1
    name: string
    slug: string
    updated_at?: string
  }

  type RecordsItem = {
    category_id: number
    created_at: string
    id: number
    note?: string
    sum: number
    updated_at?: string
    user_id?: number
  }

  type RecordsSnapshot = {
    balance: number
    created_at: string
    id: number
    note?: string
    updated_at?: string
  }

  type User = {
    id: number
    name: string
    email: string
    email_verified_at?: string
    created_at: string
    updated_at?: string
  }
}
