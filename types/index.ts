import type { Category, Transaction } from '~/gen/gql/graphql'

export type ControlSize = 'md' | 'lg' | null

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

export type ToastState = {
  autohide?: boolean | number | string
  message?: string
  modelValue?: boolean
  title?: string
  variant?: string
}

export type TransactionFormValues = {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}

export type ViewMode = 'expense' | 'income' | null
