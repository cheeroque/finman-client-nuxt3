export {}

declare global {
  type ControlSize = 'md' | 'lg' | null

  type ControlState = boolean | null

  type DialogSize = 'sm' | 'md' | 'lg' | null

  type ViewMode = 'expense' | 'income' | null

  interface PaginatorInfo {
    lastPage: number
    total: number
  }
}
