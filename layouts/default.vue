<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />

      <div class="page">
        <slot />
      </div>
    </div>

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script lang="ts" setup>
import { useRecordsStore } from '~/store/records'

const recordsStore = useRecordsStore()
await useAsyncData(() => recordsStore.fetchGlobalData())

const drawerOpen = ref(false)

function handleToggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value
}

function handleCloseDrawer(): void {
  drawerOpen.value = false
}
</script>

<style lang="scss" scoped>
.app-content {
  padding: 0 ($grid-gap * 0.5);
}

@include media-max-width(lg) {
  .layout-default {
    padding-bottom: calc(4rem + 24px);
  }
}

@include media-min-width(lg) {
  .layout-default {
    display: flex;
    height: 100vh;
  }

  .app-content {
    display: flex;
    flex: 1 1 auto;
    align-items: flex-start;
    gap: 0 $grid-gap;
    min-height: 0;
    padding: $grid-gap 0 $grid-gap $grid-gap;
    overflow: hidden;
  }

  .page {
    align-self: stretch;
    width: 100%;
    min-height: 0;
    max-height: 100%;
    padding-right: $grid-gap;
    overflow-y: auto;
  }
}
</style>
