<template>
  <UiButton class="drawer-item" icon="logout-24" icon-size="24" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
async function logout() {
  const { $auth } = useNuxtApp()

  await $auth.logout()

  /* Force app reload with external: true to re-create URQL client */

  return navigateTo('/login', { external: true })
}
</script>
