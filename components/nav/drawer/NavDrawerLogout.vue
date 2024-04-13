<template>
  <UiButton class="drawer-item" icon="logout-24" icon-size="24" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
const user = useSession()

async function logout() {
  await $fetch('/api/logout', { method: 'POST' })

  user.value = undefined

  return navigateTo('/login', { external: true })
}
</script>
