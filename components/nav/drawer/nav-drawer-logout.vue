<template>
  <UiButton icon="logout-24" icon-size="24" class="drawer-item" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script lang="ts" setup>
function logout() {
  const { signOut } = useSession()
  signOut({ callbackUrl: '/login' })
}
</script>
