import { defineStore } from 'pinia'

import type { User } from '~/gen/gql/graphql'

interface AuthState {
  user?: User
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): AuthState => ({
    user: undefined,
  }),
})
