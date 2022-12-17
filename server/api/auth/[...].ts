import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from 'next-auth'
import { NuxtAuthHandler } from '#auth'

interface UserWithToken extends User {
  token: string
}

export default NuxtAuthHandler({
  secret: process.env.NUXT_SECRET,

  callbacks: {
    async jwt(context) {
      const token = context.token
      const user = context.user as UserWithToken
      if (user) {
        token.accessToken = user.token
      }
      return token
    },
  },

  providers: [
    // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: LoginCredentials) {
        const { access_token, user } = await $fetch<LoginResponse>(`${process.env.API_URL}/login`, {
          method: 'POST',
          body: credentials,
        })

        if (user) {
          return { ...user, token: access_token }
        } else {
          throw new Error('User not found')
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/login',
  },
})
