<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />

      <div :class="{ loading: recordsStore.loading }" class="page">
        <slot />
      </div>
    </div>

    <UiToast v-bind="toast" @update:model-value="handleToastUpdate" />

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script setup lang="ts">
import { useRecordsStore } from '~/store/records'

const recordsStore = useRecordsStore()
const toast = useToast()

const drawerOpen = ref(false)

await Promise.all([recordsStore.fetchBalance(), recordsStore.fetchCategories(), recordsStore.fetchMonthRecords()])

function handleToggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function handleCloseDrawer() {
  drawerOpen.value = false
}

function handleToastUpdate(event: boolean) {
  toast.value.modelValue = event
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
    gap: 0 0 0 $grid-gap;
    min-height: 0;
    padding: 0 0 0 $grid-gap;
    overflow: hidden;
  }

  .page {
    align-self: stretch;
    width: 100%;
    min-height: 0;
    max-height: 100%;
    padding: $grid-gap;
    overflow-y: auto;
  }

  :deep(.sidebar) {
    padding: $grid-gap 0;
  }
}
</style>
