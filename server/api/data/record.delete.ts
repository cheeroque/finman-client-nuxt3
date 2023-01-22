import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()
  const url = `${config.API_URL}/records/${query.id}`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  try {
    const response = await $fetch(url, { method: 'DELETE', headers })
    return response
  } catch (error) {
    return useApiError(error)
  }
})
