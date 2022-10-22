<template>
  <UiButton icon="logout-24" icon-size="24" class="drawer-item" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script lang="ts" setup>
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

function logout() {
  authStore.logout()
}
</script>
