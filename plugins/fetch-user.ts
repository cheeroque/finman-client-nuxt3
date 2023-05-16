import type { Nuxt } from '@nuxt/schema'
import { useAuthStore } from '~/store/auth'
import { Me } from '~~/types/auth'
import ME_QUERY from '@/graphql/Me.gql'

export default defineNuxtPlugin(async (nuxtApp: Nuxt) => {
  if (process.client) return

  const authStore = useAuthStore()
  const url = nuxtApp.ssrContext.url

  if (!url.startsWith('/auth')) {
    try {
      const { data } = await useAsyncQuery<Me>(ME_QUERY)

      if (data.value?.me) {
        authStore.user = data.value.me
      }
    } catch (error) {}
  }
})
