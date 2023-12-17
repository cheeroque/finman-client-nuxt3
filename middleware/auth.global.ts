import { useAuthStore } from '~/store/auth'

import ME_QUERY from '~/graphql/Me.gql'

import type { User } from '~/types'

interface MeResponse {
  me: User
}

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth, $urql } = useNuxtApp()

  const authStore = useAuthStore()
  const isLoginPage = to.path.startsWith('/login')

  let isLoggedIn = Boolean(authStore.user)

  /* Try to fetch user from backend. Return user on success, false on error */

  async function fetchUser() {
    try {
      const { data } = await $urql.query<MeResponse>(ME_QUERY, {}).toPromise()

      if (!data?.me) {
        throw createError({ statusCode: 401 })
      }

      return data.me
    } catch (error: any) {
      return false
    }
  }

  /* Fetch user if not in store. On fail redirect to the login page (if not
   * already there). On success, save user to store and set isLoggedIn to true */

  if (!isLoggedIn) {
    const user = await fetchUser()

    if (user) {
      authStore.user = user
      isLoggedIn = true
    } else {
      $auth.reset()

      if (!isLoginPage) {
        return navigateTo('/login', { external: true })
      }
    }
  }

  /* If current route is login and isLoggedIn is true, redirect to root */

  if (isLoggedIn && isLoginPage) {
    return navigateTo('/')
  }
})
