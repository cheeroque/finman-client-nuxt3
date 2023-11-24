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
import { useQuery } from '@urql/vue'
import { useRecordsStore } from '~/store/records'

import CATEGORIES_QUERY from '~/graphql/Categories.gql'
import RECORDS_TOTAL_QUERY from '~/graphql/RecordsTotal.gql'

import type { RecordsCategory } from '~/types/records'

interface CategoriesQueryResponse {
  categories: {
    data: RecordsCategory[]
    paginatorInfo: PaginatorInfo
  }
}

interface RecordsTotalResponse {
  expensesTotal: number
  incomesTotal: number
}

const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const drawerOpen = ref(false)

/* Fetch record categories and save them to the store */

const { data: categoryData, executeQuery: refetchCategories } = useQuery<CategoriesQueryResponse>({
  query: CATEGORIES_QUERY,
})

watchEffect(() => {
  if (categoryData.value) {
    recordsStore.categories = categoryData.value.categories.data
  }
})

/* Fetch total balance and save it to the store */

const { data: balanceData, executeQuery: refetchBalance } = await useQuery<RecordsTotalResponse>({
  query: RECORDS_TOTAL_QUERY,
})

watchEffect(() => {
  if (balanceData.value) {
    const incomesTotal = Number(balanceData.value?.incomesTotal) || 0
    const expensesTotal = Number(balanceData.value?.expensesTotal) || 0

    recordsStore.balance = incomesTotal - expensesTotal
  }
})

watch(
  /* Refetch categories & total balance if external trigger was set to true,
   * then reset trigger */
  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await Promise.all([refetchBalance(), refetchCategories()])
      refetchTrigger.value = false
    }
  }
)

await Promise.all([recordsStore.fetchMonthRecords()])

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
