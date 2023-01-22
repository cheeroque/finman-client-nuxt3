import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const url = `${config.API_URL}/export`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  try {
    const filePath = await $fetch(url, { method: 'GET', headers })
    return `${config.STATIC_URL}/${filePath}`
  } catch (error) {
    return useApiError(error)
  }
})
