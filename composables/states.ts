import { UserFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

type User = FragmentOf<typeof UserFragment>

export const useRefetchTrigger = () => useState('refetch-trigger', () => false)

export const useSession = () => useState<User | undefined>('user', () => undefined)
