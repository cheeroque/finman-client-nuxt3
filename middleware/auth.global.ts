export default defineNuxtRouteMiddleware(async (to) => {
  /* Skip middleware on API routes */
  if (to.path.startsWith('/api')) return

  const user = useUser()

  const data = await useRequestFetch()('/api/user')

  if (data) {
    user.value = data
  }

  if (!to.meta.isPublic && !user.value) {
    return navigateTo('/login', { external: true })
  }

  if (to.path.startsWith('/login') && user.value) {
    return navigateTo('/')
  }
})
