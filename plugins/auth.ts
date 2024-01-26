import { useAuthStore } from '~/store/auth'

import type { LoginMutationVariables } from '~/gen/gql/graphql'

type AuthPlugin = {
  login: (credentials: LoginMutationVariables) => Promise<void>
  logout: () => Promise<void>
}

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  async function login(credentials: LoginMutationVariables) {
    try {
      const { user } = await $fetch('/api/login', {
        method: 'POST',
        body: credentials,
      })

      if (user) {
        authStore.user = user
      }
    } catch (error: any) {
      throw createError({
        statusCode: 401,
        statusMessage: error?.message,
      })
    }
  }

  async function logout() {
    try {
      await $fetch('/api/logout', { method: 'POST' })
    } catch (error) {
      /* Ignore error when trying to log out without token */
    }

    authStore.user = undefined
  }

  const auth = { login, logout }

  return { provide: { auth } }
})

declare module '#app' {
  interface NuxtApp {
    $auth: AuthPlugin
  }
}
