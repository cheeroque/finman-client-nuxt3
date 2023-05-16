import { useAuthStore } from '~/store/auth'
import { LoginCredentials, LoginResponseData } from '~~/types/auth'

import LOGIN_MUTATION from '@/graphql/Login.gql'
import LOGOUT_MUTATION from '@/graphql/Logout.gql'

export default defineNuxtPlugin((nuxtApp) => {
  const { onLogin, onLogout } = useApollo()
  const authStore = useAuthStore()

  async function login(credentials: LoginCredentials) {
    const { mutate } = useMutation<LoginResponseData>(LOGIN_MUTATION)

    try {
      const response = await mutate(credentials)

      if (response?.data?.login) {
        const { access_token, user } = response.data.login

        authStore.user = user
        return onLogin(access_token)
      } else {
        throw createError({ statusCode: 401 })
      }
    } catch (error: any) {
      handleAuthError(error)
    }
  }

  async function logout() {
    const { mutate } = useMutation(LOGOUT_MUTATION)
    await mutate()
    reset()
  }

  function handleAuthError(error?: any) {
    const isAuthError = error?.message === 'Unauthenticated.'

    if ((error?.graphQLErrors?.length && isAuthError) || error.statusCode === 401) {
      /* Authentication error => reset auth */
      reset()
      throw createError({ statusCode: 401, message: error.message })
    } else {
      /* Non-authentication error */
      throw error
    }
  }

  function reset() {
    authStore.user = undefined
    return onLogout()
  }

  const auth = { login, logout, reset }

  return { provide: { auth } }
})
