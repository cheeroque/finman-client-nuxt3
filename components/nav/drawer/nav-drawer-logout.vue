<template>
  <UiButton icon="logout-24" icon-size="24" class="drawer-item" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
async function logout() {
  const { $auth } = useNuxtApp()

  await $auth.logout()

  return navigateTo('/login', { external: true })
}
</script>
