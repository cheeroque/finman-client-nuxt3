import { useAuthStore } from '~/store/auth'

import type { CookieOptions } from 'nuxt/app'
import type { AuthPlugin, LoginCredentials, User } from '~/types'

type LoginResponse = {
  user?: User
}

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

const COOKIE_OPTIONS: Omit<CookieOptions, 'readonly'> = {
  path: '/',
  sameSite: 'lax',
}

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  const tokenCookie = useCookie(TOKEN_KEY, COOKIE_OPTIONS)
  const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, COOKIE_OPTIONS)

  async function login(credentials: LoginCredentials) {
    try {
      const { user } = await $fetch<LoginResponse>('/api/login', {
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

    reset()
  }

  function getToken(refresh?: boolean) {
    return refresh ? refreshTokenCookie.value : tokenCookie.value
  }

  function setToken(token?: string, refresh?: boolean) {
    if (refresh) {
      refreshTokenCookie.value = token
    } else {
      tokenCookie.value = token
    }
  }

  function reset() {
    authStore.user = undefined
    setToken(undefined)
    setToken(undefined, true)
  }

  const auth = { login, logout, getToken, setToken, reset }

  return { provide: { auth } }
})

declare module '#app' {
  interface NuxtApp {
    $auth: AuthPlugin
  }
}
