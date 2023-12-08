import type { User } from '~/types'

export interface RecordsCategory {
  color?: string
  created_at?: string
  id: number
  is_income: boolean
  name: string
  slug: string
  updated_at?: string
}

export interface RecordsItem {
  category: RecordsCategory
  created_at: string
  id: number
  note?: string
  sum: number
  updated_at?: string
  user?: User
}

export interface RecordsResponse {
  records: {
    data: RecordsItem[]
    paginatorInfo?: PaginatorInfo
  }
}

export interface RecordsSnapshot {
  balance: number
  created_at: string
  id: number
  note?: string
  updated_at?: string
}
