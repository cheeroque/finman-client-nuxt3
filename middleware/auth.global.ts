import { useAuthStore } from '~/store/auth'
import { AuthError } from '~/plugins/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  /* Guard only pages that are not public */
  if (!to.meta.isPublic) {
    const authStore = useAuthStore()

    if (!authStore.user) {
      const { $auth } = useNuxtApp()
      const { getToken } = useApollo()
      const token = await getToken()

      if (!token) {
        $auth.reset()
        return navigateTo('/auth/login')
      }

      try {
        await $auth.fetchUser()
      } catch (error: any) {
        if (error?.code instanceof AuthError) {
          $auth.reset()
          return navigateTo('/auth/login')
        }
      }
    }
  }
})
