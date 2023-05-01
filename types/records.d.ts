import { User } from '~~/types/auth'

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

interface RecordsQueryResponse {
  records: RecordsQueryResponseRecords
}

interface RecordsQueryResponseRecords {
  data: RecordsItem[]
  paginatorInfo: PaginatorInfo
}

interface RecordsQueryVariables {
  first: number
  hasCategory?: WhereConditions
  orderBy: OrderByClause[]
  page: number
  where?: RecordsQueryWhereConditions | WhereConditions
}

interface RecordsQueryWhereConditions {
  [key: AND | OR]: RecordsQueryWhereConditions | WhereConditions[]
}

export interface RecordsSnapshot {
  balance: number
  created_at: string
  id: number
  note?: string
  updated_at?: string
}
