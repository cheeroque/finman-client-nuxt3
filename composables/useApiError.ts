import { FetchError } from 'ofetch'

export const useApiError = (error: unknown) => {
  let statusCode = 500
  let statusMessage = 'Unspecified error'

  if (error instanceof FetchError) {
    statusMessage = error.data.error
    if (error.status) statusCode = error.status
  }

  return createError({ statusMessage, statusCode })
}
