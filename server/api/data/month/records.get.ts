import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)

  const config = useRuntimeConfig()
  const url = `${config.API_URL}/month/${query.month}`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  try {
    const response = await $fetch(url, { method: 'GET', headers, query })
    return response
  } catch (error) {
    return useApiError(error)
  }
})
