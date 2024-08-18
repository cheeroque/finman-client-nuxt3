<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />

      <div :class="{ loading: pending }" class="page">
        <slot />
      </div>
    </div>

    <UiToast v-bind="toast" @hide="handleToastHide" />

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script setup lang="ts">
const globalStore = useGlobalStore()
const { balance, categories, firstTransaction, pending, refreshTrigger } = storeToRefs(globalStore)

const { error, refresh } = await useAsyncData('global', async () => {
  pending.value = true

  const response = await useRequestFetch()('/api/global-data')

  balance.value = response.balance
  categories.value = response.categories
  firstTransaction.value = response.firstTransaction ?? null

  pending.value = false

  return true
})

if (error.value) {
  showError({
    ...error.value,
    fatal: true,
  })
}

/* Refetch data if external trigger was set to true, then reset trigger */
watch(
  () => refreshTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refreshTrigger.value = false
    }
  }
)

const drawerOpen = ref(false)

function handleToggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function handleCloseDrawer() {
  drawerOpen.value = false
}

const toast = useToast()

function handleToastHide() {
  useHideToast()
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
    min-height: 0;
    max-height: 100%;
    padding: $grid-gap 0;
    overflow-y: auto;
  }
}
</style>
