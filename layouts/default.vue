<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />

      <div :class="{ loading: loading }" class="page">
        <slot />
      </div>
    </div>

    <UiToast v-bind="toast" @update:model-value="handleToastUpdate" />

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { Transaction } from '~/gen/gql/graphql'

const balance = useBalance()
const categories = useCategories()
const loading = useIsBusy()
const startDate = useStartDate()

const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const drawerOpen = ref(false)

const { error, refresh } = await useFetch('/api/global-data', {
  onResponse({ response }) {
    balance.value = response._data.balance
    categories.value = response._data.categories
    startDate.value = getDate(response._data.firstTransaction)
  },
})

if (error.value) {
  throw createError({ fatal: true, message: error.value.message })
}

watch(
  /* Refetch global data when external trigger set to true, then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)

function getDate(transaction?: Transaction) {
  let dateTime = DateTime.fromFormat(transaction?.created_at ?? '', 'yyyy-LL-dd HH:mm:ss')

  if (!dateTime.isValid) {
    dateTime = DateTime.now()
  }

  const { month, year } = dateTime

  return { month, year }
}

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
    min-height: 0;
    max-height: 100%;
    padding: $grid-gap 0;
    overflow-y: auto;
  }
}
</style>
