import { defineStore } from 'pinia'

interface State {
  user?: User
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): State => ({
    user: undefined,
  }),
})
