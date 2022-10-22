<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />
      <slot />
    </div>

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script lang="ts" setup>
const drawerOpen = ref(false)

function handleToggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value
}

function handleCloseDrawer(): void {
  drawerOpen.value = false
}
</script>

<style lang="scss" scoped>
@include media-min-width(lg) {
  .layout-default {
    display: flex;
    height: 100vh;
  }

  .app-content {
    flex: 1 1 auto;
    min-height: 0;
    padding: $grid-gap;
    overflow-y: auto;
  }
}
</style>
