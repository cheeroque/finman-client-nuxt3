export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth } = useNuxtApp()
  const loggedIn = $auth.loggedIn()

  if (!loggedIn) {
    const success = await $auth.fetchUser()
    if (!success && to.name !== 'auth-login') {
      await navigateTo('/auth/login')
    }
  }
})
