import { defineStore } from 'pinia'
import type { User } from '~/types/auth'

interface State {
  user?: User
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): State => ({
    user: undefined,
  }),
})
