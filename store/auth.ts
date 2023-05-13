import { defineStore } from 'pinia'
import { User } from '~~/types/auth'

interface State {
  token?: string
  user?: User
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): State => ({
    token: undefined,
    user: undefined,
  }),
})
