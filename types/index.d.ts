import type { Category, Transaction } from '~/gen/gql/graphql'

declare global {
  type ControlSize = 'md' | 'lg' | null

  type ControlState = boolean | null

  type DialogSize = 'sm' | 'md' | 'lg' | null

  type ViewMode = 'expense' | 'income' | null
}

export type GroupTableItem = {
  group: number | string
  subtotal?: number
  transactions?: Partial<Transaction>[]
  trClass?: string
}

export type NavLink = {
  icon?: string
  link: string
  text: string
}

export type TableField = {
  key: string
  label?: string
  tdClass?: string
  thClass?: string
}

export type TableItem = {
  [key: string]: any
}

export type TableMonthItem = GroupTableItem & {
  category?: Partial<Category>
}

export type TransactionFormValues = {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}
