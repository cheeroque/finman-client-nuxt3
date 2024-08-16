import { CategoryFragment, TransactionFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

export type Category = FragmentOf<typeof CategoryFragment>

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
  category?: Category
}

export type ToastState = {
  autohide?: boolean | number | string
  message?: string
  modelValue?: boolean
  title?: string
  variant?: string
}

/* Reworked types */

import { CategoriesTable, TransactionsTable } from '~/server/db/schema'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type LoginCredentials = {
  password: string
  username: string
}

export type Transaction = InferSelectModel<typeof TransactionsTable> & {
  category: InferSelectModel<typeof CategoriesTable> | null
}

export type TransactionInsert = InferInsertModel<typeof TransactionsTable>

export type ViewMode = 'expense' | 'income'

/* Extend definePageMeta */
declare module '#app' {
  interface PageMeta {
    isPublic?: boolean
  }
}
