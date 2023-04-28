export {}

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

  interface WhereHasConditions {
    column?: string
    operator?: string
    value?: string | number | boolean
  }
}
