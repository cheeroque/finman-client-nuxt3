import { useAuthStore } from '~/store/auth'
import { LoginCredentials, LoginResponseData, Me, User } from '~~/types/auth'
import ME_QUERY from '@/graphql/Me.gql'
import LOGIN_MUTATION from '@/graphql/Login.gql'
import LOGOUT_MUTATION from '@/graphql/Logout.gql'

export class AuthError extends Error {
  code?: string
  message: string

  constructor({ code, message }: { code?: string; message: string }) {
    super()

    Object.setPrototypeOf(this, AuthError.prototype)

    this.code = code
    this.message = message
  }
}

export default defineNuxtPlugin(() => {
  const { onLogin, onLogout } = useApollo()
  const authStore = useAuthStore()

  async function fetchUser() {
    try {
      const { data } = await useAsyncQuery<Me>(ME_QUERY)

      if (data.value?.me) {
        storeUser(data.value.me)
      } else {
        handleAuthError(createError({ statusCode: 401 }))
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function login(credentials: LoginCredentials) {
    const { mutate } = useMutation<LoginResponseData>(LOGIN_MUTATION)

    try {
      const response = await mutate(credentials)

      if (response?.data?.login) {
        const { access_token, user } = response.data.login

        storeUser(user)
        storeToken(access_token)
        onLogin(access_token)
      } else {
        handleAuthError()
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

      const authError = new AuthError({ code: '401', message: error.message })
      throw authError
    } else {
      /* Non-authentication error */
      throw error
    }
  }

  function reset() {
    storeUser()
    storeToken()
    onLogout()
  }

  function storeToken(token?: string) {
    authStore.token = token
  }

  function storeUser(user?: User) {
    authStore.user = user
  }

  const auth = { fetchUser, login, logout, reset }

  return { provide: { auth } }
})
