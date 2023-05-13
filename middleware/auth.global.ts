import { useAuthStore } from '~/store/auth'
import { Me } from '~~/types/auth'
import ME_QUERY from '@/graphql/Me.gql'

export default defineNuxtRouteMiddleware(async (to) => {
  /* Guard only pages that are not public */
  if (!to.meta.isPublic) {
    const authStore = useAuthStore()

    if (!authStore.user) {
      try {
        const { data } = await useAsyncQuery<Me>(ME_QUERY)

        if (data.value?.me) {
          authStore.user = data.value.me
        } else {
          throw createError({ statusCode: 401 })
        }
      } catch (error: any) {
        if (error.statusCode === 401) {
          authStore.user = undefined
          return navigateTo('/auth/login')
        }
      }
    }
  }
})
