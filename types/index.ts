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

import { CategoriesTable, RevisesTable, TransactionsTable } from '~/server/db/schema'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Category = InferSelectModel<typeof CategoriesTable>

export type CategoryInsert = InferInsertModel<typeof CategoriesTable>

export type ControlSize = 'md' | 'lg' | null

export type LoginCredentials = {
  password: string
  username: string
}

export type Snapshot = InferSelectModel<typeof RevisesTable>

export type SnapshotInsert = InferInsertModel<typeof RevisesTable>

export type Transaction = InferSelectModel<typeof TransactionsTable> & {
  category: Category | null
}

export type TransactionInsert = InferInsertModel<typeof TransactionsTable>

export type ViewMode = 'expense' | 'income'

/* Extend definePageMeta */
declare module '#app' {
  interface PageMeta {
    isPublic?: boolean
  }
}
