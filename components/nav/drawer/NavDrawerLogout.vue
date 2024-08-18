<template>
  <UiButton :loading="loading" class="drawer-item" icon="logout-24" icon-size="24" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
const loading = ref(false)

async function logout() {
  loading.value = true

  await $fetch('/api/logout', { method: 'POST' })

  loading.value = false

  return navigateTo('/login', { external: true })
}
</script>
