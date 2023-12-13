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

import CATEGORIES_QUERY from '~/graphql/Categories.gql'
import RECORDS_QUERY from '~/graphql/Records.gql'
import RECORDS_TOTAL_QUERY from '~/graphql/RecordsTotal.gql'

import type { RecordsCategory, RecordsResponse } from '~/types'

interface CategoriesResponse {
  categories: {
    data: RecordsCategory[]
    paginatorInfo: PaginatorInfo
  }
}

interface RecordsTotalResponse {
  expensesTotal: number
  incomesTotal: number
}

const { $urql } = useNuxtApp()
const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const drawerOpen = ref(false)

const { refresh } = await useAsyncData(() => fetchGlobalData())

watch(
  /* Refetch categories & total balance if external trigger was set to true,
   * then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)

/* Fetch total balance, record categories and first record (for calendar)
 * and save everything to the store */

async function fetchGlobalData() {
  const variables = {
    first: 1,
    orderBy: [{ column: 'CREATED_AT', order: 'ASC' }],
  }

  const [{ data: balanceData }, { data: categoriesData }, { data: firstRecordData }] = await Promise.all([
    $urql.query<RecordsTotalResponse>(RECORDS_TOTAL_QUERY, {}).toPromise(),
    $urql.query<CategoriesResponse>(CATEGORIES_QUERY, {}).toPromise(),
    $urql.query<RecordsResponse>(RECORDS_QUERY, variables).toPromise(),
  ])

  const expensesTotal = Number(balanceData?.expensesTotal) || 0
  const incomesTotal = Number(balanceData?.incomesTotal) || 0

  recordsStore.balance = incomesTotal - expensesTotal
  recordsStore.categories = categoriesData?.categories.data ?? []
  recordsStore.firstRecord = firstRecordData?.records.data?.[0]
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
