import { useCookie } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie('auth_token')

  if (to.name !== 'login') {
    if (!token.value) {
      return navigateTo('/login')
    }
  }
})
