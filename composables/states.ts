import type { User } from '~/gen/gql/graphql'

export const useRefetchTrigger = () => useState('refetch-trigger', () => false)

export const useSession = () => useState<User | undefined>('user', () => undefined)

export const useToast = () =>
  useState('toast', () => ({
    autohide: 5000,
    message: '',
    modelValue: false,
    title: '',
    variant: 'success',
  }))
