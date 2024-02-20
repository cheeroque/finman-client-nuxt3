import type { Category, User } from '~/gen/gql/graphql'

type StartDate = {
  month: number
  year: number
}

export const useBalance = () => useState('balance', () => 0)

export const useCategories = () => useState<Category[]>('categories', () => [])

export const useIsBusy = () => useState('is-busy', () => false)

export const useRefetchTrigger = () => useState('refetch-trigger', () => false)

export const useSession = () => useState<User | undefined>('user', () => undefined)

export const useStartDate = () => useState<StartDate | undefined>('start-date', () => undefined)
