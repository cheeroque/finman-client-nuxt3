export { AuthPlugin, LoginCredentials, User } from './auth'
export { NavLink } from './nav'
export { RecordsCategory, RecordsItem, RecordsResponse, RecordsSnapshot } from './records'

import type { Category, Transaction } from '~/gen/gql/graphql'

declare global {
  type ControlSize = 'md' | 'lg' | null

  type ControlState = boolean | null

  type DialogSize = 'sm' | 'md' | 'lg' | null

  type ViewMode = 'expense' | 'income' | null

  interface OrderByClause {
    column: string
    order: string
  }

  interface PaginatorInfo {
    lastPage: number
    total: number
  }

  interface WhereConditions {
    column?: string
    operator?: string
    value?: string | number | boolean
  }
}

export type TableMonthItem = {
  category?: Partial<Category>
  group: string
  transactions?: Partial<Transaction>[]
  subtotal: number
  trClass?: string
}
