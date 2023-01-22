import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = `${config.API_URL}/users/me`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  try {
    const response = await $fetch(url, { method: 'GET', headers })
    return response
  } catch (error) {
    return useApiError(error)
  }
})
