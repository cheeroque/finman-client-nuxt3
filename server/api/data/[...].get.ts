import { useApiError } from '~/composables/useApiError'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const endpoint = getRouterParam(event, '_')
  const url = `${config.API_URL}/${endpoint}`

  /* Get headers saved in middleware from context */
  const { headers } = event.context

  /* Get URL query */
  const query = getQuery(event)

  try {
    const response = await $fetch(url, { method: 'GET', headers, query })
    return response
  } catch (error) {
    return useApiError(error)
  }
})
