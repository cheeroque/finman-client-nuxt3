import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const url = `${config.API_URL}/categories`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  try {
    const response = await $fetch(url, { method: 'POST', body, headers })
    return response
  } catch (error) {
    return useApiError(error)
  }
})
