<template>
  <UiButton class="drawer-item" icon="logout-24" icon-size="24" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

async function logout() {
  await useFetch('/api/logout', { method: 'POST' })

  authStore.user = undefined

  return navigateTo('/login', { external: true })
}
</script>
