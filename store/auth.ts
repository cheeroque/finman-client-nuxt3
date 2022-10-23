import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { useCookie, useRouter, useRuntimeConfig, CookieRef } from '#app'
import jwt_decode, { JwtPayload } from 'jwt-decode'

interface State {
  user: CookieRef<User>
  token: CookieRef<string>
}

export const useAuthStore = defineStore({
  id: 'auth',

  state: (): State => ({
    user: useCookie('auth_user'),
    token: useCookie('auth_token'),
  }),

  actions: {
    async login(credentials: LoginCredentials): Promise<void> {
      const runtimeConfig = useRuntimeConfig()
      const apiUrl = runtimeConfig.public.apiUrl

      const { access_token, user } = await $fetch<LoginResponse>(`${apiUrl}/login`, {
        method: 'POST',
        body: credentials,
      })

      this.user = user
      this.token = access_token

      const decoded: JwtPayload = jwt_decode(access_token)
      const expires = DateTime.fromSeconds(decoded.exp).toJSDate()
      const cookieOptions = {
        expires,
        path: '/',
        sameSite: true,
      }

      const userCookie = useCookie('auth_user', cookieOptions)
      const tokenCookie = useCookie('auth_token', cookieOptions)

      userCookie.value = JSON.stringify(user)
      tokenCookie.value = access_token
    },

    logout() {
      const router = useRouter()
      const userCookie = useCookie('auth_user')
      const tokenCookie = useCookie('auth_token')

      this.user = null
      this.token = null
      userCookie.value = null
      tokenCookie.value = null

      router.push('/login')
    },
  },
})
