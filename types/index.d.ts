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

export type GroupTableItem = {
  group: number | string
  subtotal?: number
  transactions?: Partial<Transaction>[]
  trClass?: string
}

export type TableMonthItem = GroupTableItem & {
  category?: Partial<Category>
}
