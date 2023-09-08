import { useAuthStore } from '~/store/auth'

import ME_QUERY from '~/graphql/Me.gql'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth, $urql } = useNuxtApp()
  const authStore = useAuthStore()

  async function fetchUser() {
    try {
      const { data } = await $urql.query(ME_QUERY, {})

      if (!data?.me) throw createError({ statusCode: 401 })

      return data.me
    } catch (error: any) {}
  }

  if (!authStore.user) {
    const user = await fetchUser()

    if (user) {
      authStore.user = user

      if (to.meta.isPublic) {
        return navigateTo('/')
      }
    } else if (!to.meta.isPublic) {
      $auth.reset()
      return navigateTo('/login')
    }
  }
})
