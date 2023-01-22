import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore()

  async function fetchUser(): Promise<boolean> {
    let success = false
    try {
      const headers = useRequestHeaders(['cookie']) as HeadersInit
      const user = await $fetch<User>('/api/auth/me', { method: 'GET', headers })
      authStore.user = user
      success = true
    } catch (error) {
      await reset()
    }
    return success
  }

  async function reset() {
    /* Auth cookie is HTTP-only, so it can be modified
     * only server-side, via API request */
    await $fetch<User>('/api/auth/logout', { method: 'GET' })

    /* Remove user from store */
    authStore.user = undefined
  }

  async function logout() {
    await reset()

    /* Redirect to login page */
    return navigateTo('/auth/login')
  }

  const auth = {
    fetchUser,
    loggedIn: () => Boolean(authStore.user),
    logout,
    reset,
    user: authStore.user,
  }

  return {
    provide: { auth },
  }
})
