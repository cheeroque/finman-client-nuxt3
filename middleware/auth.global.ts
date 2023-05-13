import { useAuthStore } from '~/store/auth'
import { AuthError } from '~/plugins/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  /* Guard only pages that are not public */
  if (!to.meta.isPublic) {
    const authStore = useAuthStore()
    const { $auth } = useNuxtApp()

    if (!authStore.token) {
      try {
        await $auth.fetchUser()
      } catch (error: any) {
        if (error instanceof AuthError) {
          // $auth.reset()
          return navigateTo('/auth/login')
        }
      }
    }
  }
})
