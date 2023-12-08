import { useAuthStore } from '~/store/auth'

import LOGIN_MUTATION from '~/graphql/Login.gql'
import LOGOUT_MUTATION from '~/graphql/Logout.gql'

import type { Client } from '@urql/core'
import type { CookieOptions } from 'nuxt/app'
import type { AuthPlugin, LoginCredentials, User } from '~/types/auth'

interface LoginResponse {
  login: {
    access_token: string
    refresh_token?: string
    user: User
  }
}

interface LogoutResponse {
  logout: {
    message?: string
    status: string
  }
}

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

const COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'lax',
}

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  const tokenCookie = useCookie(TOKEN_KEY, COOKIE_OPTIONS)
  const refreshTokenCookie = useCookie(REFRESH_TOKEN_KEY, COOKIE_OPTIONS)

  async function login(credentials: LoginCredentials) {
    if (!nuxtApp.$urql) return

    const $urql = nuxtApp.$urql as Client

    const { data, error } = await $urql.mutation<LoginResponse>(LOGIN_MUTATION, credentials).toPromise()

    if (data?.login) {
      const { access_token, refresh_token, user } = data.login

      authStore.user = user
      setToken(access_token)
      setToken(refresh_token, true)
    } else {
      throw createError({
        statusCode: 401,
        statusMessage: error?.message,
      })
    }
  }

  async function logout() {
    if (!nuxtApp.$urql) return

    const $urql = nuxtApp.$urql as Client

    try {
      await $urql.mutation<LogoutResponse>(LOGOUT_MUTATION, {}).toPromise()
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
