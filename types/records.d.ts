export interface RecordsCategory {
  color?: string
  created_at: string
  id: number
  is_income: 0 | 1
  name: string
  slug: string
  updated_at?: string
}

export interface RecordsItem {
  category: RecordsCategory
  category_id: number
  created_at: string
  id: number
  note?: string
  sum: number
  updated_at?: string
  user_id?: number
}

export interface RecordsSnapshot {
  balance: number
  created_at: string
  id: number
  note?: string
  updated_at?: string
}