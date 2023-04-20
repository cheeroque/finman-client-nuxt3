import { defineStore } from 'pinia'
import { User } from '~~/types/auth'

interface State {
  user?: User
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): State => ({
    user: undefined,
  }),
})
