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

  type NavLink = {
    icon?: string
    link: string
    text: string
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
    category: RecordsCategory
    category_id: number
    created_at: string
    id: number
    note?: string
    sum: number
    updated_at?: string
    user_id?: number
  }

  type RecordsRequestOrder = 'DESC' | 'ASC' | null

  type RecordsRequestParams = {
    order?: string
    orderBy?: string
    page?: number
    perPage?: number
    show?: ViewMode
  }

  type RecordsResponse = {
    current_page: number
    data: RecordsItem[]
    first_page_url: string
    from: number
    last_page: string
    last_page_url: string
    links: RecordsResponseLink[]
    next_page_url: string
    path: string
    per_page: number | string
    prev_page_url: string
    to: number
    total: number
  }

  type RecordsResponseLink = {
    active: boolean
    label: string
    url: string
  }

  type RecordsSnapshot = {
    balance: number
    created_at: string
    id: number
    note?: string
    updated_at?: string
  }

  type ViewMode = 'expense' | 'income' | null

  type User = {
    id: number
    name: string
    email: string
    email_verified_at?: string
    created_at: string
    updated_at?: string
  }
}
