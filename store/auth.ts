import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { useCookie, useRouter, useRuntimeConfig } from '#app'
import jwt_decode, { JwtPayload } from 'jwt-decode'

export const useAuthStore = defineStore({
  id: 'auth',

  state: () => ({
    user: useCookie('auth_user'),
    token: useCookie('auth_token'),
  }),

  actions: {
    async login(credentials) {
      const runtimeConfig = useRuntimeConfig()
      const apiUrl = runtimeConfig.public.apiUrl

      const { access_token, user } = (await $fetch(`${apiUrl}/login`, {
        method: 'POST',
        body: credentials,
      })) as LoginResponse

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
