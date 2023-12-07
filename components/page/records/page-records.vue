<template>
  <PageContent :loading="recordsStore.loading" class="page-records" spinner-variant="primary">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable v-if="data" :records="data.records" :view-mode="viewMode" />

    <RecordFab :show="!paginationVisible" />

    <template #footer>
      <div ref="paginationAnchor" v-if="Number(data?.totalPages) > 1">
        <UiPagination :disabled="recordsStore.loading" :total-pages="data?.totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useRecordsStore } from '~/store/records'

import RECORDS_QUERY from '~/graphql/Records.gql'

import type { RecordsItem } from '~/types/records'

interface RecordsResponse {
  records: {
    data: RecordsItem[]
    paginatorInfo: PaginatorInfo
  }
}

const { $urql } = useNuxtApp()
const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const route = useRoute()

const observer = ref()
const paginationAnchor = ref()
const paginationVisible = ref(false)

const viewMode = computed<ViewMode>(() => route.params.view as ViewMode)

const { data, refresh } = await useAsyncData(() => fetchRecords())

watch(
  /* Refetch records if external trigger was set to true, then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)

watch(
  /* Refetch records and scroll page to the top on route query change */

  () => route.query,

  async () => {
    await refresh()

    setTimeout(() => {
      const windowTop = useWindowTop()
      const target = !windowTop ? '.page' : undefined

      useScrollTo(target)
    }, 250)
  }
)

/* Observe pagination element to hide/show FAB on scroll */

onMounted(() => setObserver())
onUnmounted(() => removeObserver())

async function fetchRecords() {
  const column = route.query.orderBy ? String(route.query.orderBy) : 'CREATED_AT'
  const order = route.query.order ? String(route.query.order) : 'DESC'
  const first = Number(route.query.perPage) || 50
  const page = Number(route.query.page) || 1

  const isExpense = viewMode.value === 'expense'
  const isIncome = viewMode.value === 'income'

  const hasCategory =
    isExpense || isIncome
      ? {
          column: 'IS_INCOME',
          operator: 'EQ',
          value: isIncome,
        }
      : undefined

  const variables = { first, hasCategory, orderBy: [{ column, order }], page }

  recordsStore.pending++

  const { data } = await $urql.query<RecordsResponse>(RECORDS_QUERY, variables).toPromise()

  const records = ref(data?.records.data ?? [])
  const totalPages = ref(data?.records.paginatorInfo?.lastPage ?? 1)

  recordsStore.pending--

  return reactive({ records, totalPages })
}

function setObserver() {
  if (!process.client || !paginationAnchor.value) return

  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(([{ isIntersecting }]) => {
      paginationVisible.value = isIntersecting
    })
    observer.value.observe(paginationAnchor.value)
  }
}

function removeObserver() {
  if (paginationAnchor.value && observer.value instanceof IntersectionObserver) {
    observer.value.unobserve(paginationAnchor.value)
  }
}
</script>

<style lang="scss" scoped>
.page-records {
  :deep(.page-content-body) {
    padding: 0 0 0.5rem;
  }

  :deep(.page-content-footer) {
    display: flex;
    justify-content: center;
  }
}

@include media-min-width(lg) {
  .page-records {
    :deep(.page-content-header) {
      padding: 1.25rem 0 0;
    }

    :deep(.page-content-body) {
      padding: 0;
    }

    :deep(.page-content-footer) {
      justify-content: flex-end;
    }
  }
}

@include media-min-width(xxl) {
  .page-records {
    :deep(.page-content-header) {
      padding: 1.25rem 1rem;
    }
  }
}
</style>
