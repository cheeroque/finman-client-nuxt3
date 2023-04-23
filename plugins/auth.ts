import { useAuthStore } from '~/store/auth'
import { LoginCredentials, LoginResponseData, User } from '~~/types/auth'
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

  async function login(credentials: LoginCredentials) {
    const { mutate } = useMutation<LoginResponseData>(LOGIN_MUTATION)

    try {
      const response = await mutate(credentials)

      if (response?.data?.login) {
        const { access_token, user } = response.data.login

        storeUser(user)
        onLogin(access_token)

        navigateTo('/')
      }
    } catch (error: any) {
      reset()

      if (error?.graphQLErrors?.length) {
        const message = error?.message ?? 'Unauthenticated'
        const authError = new AuthError({ code: '401', message })
        throw authError
      } else {
        throw error
      }
    }
  }

  async function logout() {
    const { mutate } = useMutation(LOGOUT_MUTATION)
    await mutate()
    reset()
  }

  function reset() {
    storeUser()
    onLogout()
    navigateTo('/auth/login')
  }

  function storeUser(user?: User) {
    const authStore = useAuthStore()
    authStore.user = user
  }

  const auth = { login, logout, reset }

  return { provide: { auth } }
})
