<template>
  <PageContent :loading="recordsStore.loading" class="page-records" spinner-variant="primary">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" @update:records="executeQuery" />

    <RecordFab :show="!paginationVisible" @update:records="executeQuery" />

    <template #footer>
      <div ref="paginationAnchor" v-if="totalPages > 1">
        <UiPagination :disabled="recordsStore.loading" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useQuery } from '@urql/vue'
import { useRecordsStore } from '~/store/records'
import RECORDS_QUERY from '~/graphql/Records.gql'

import type { RecordsQueryResponse } from '~/types/records'

const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const route = useRoute()

const viewMode = computed<ViewMode>(() => route.params.view as ViewMode)

const variables = computed(() => {
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

  return {
    first,
    hasCategory,
    orderBy: [{ column, order }],
    page,
  }
})

const { data, executeQuery } = await useQuery<RecordsQueryResponse>({ query: RECORDS_QUERY, variables })

const records = computed(() => data.value?.records.data ?? [])
const totalPages = computed(() => data.value?.records.paginatorInfo?.lastPage ?? 1)

watch(
  /* Refetch records if external trigger was set to true, then reset trigger */
  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await executeQuery()
      refetchTrigger.value = false
    }
  }
)

watch(
  /* Refetch records and scroll page to the top on route query change */
  () => route.query,

  async () => {
    await executeQuery()

    setTimeout(() => {
      const windowTop = useWindowTop()
      const target = !windowTop ? '.page' : undefined

      useScrollTo(target)
    }, 250)
  }
)

/** Observe pagination element to hide/show FAB on scroll */
onMounted(() => {
  setObserver()
})

onUnmounted(() => {
  removeObserver()
})

const observer = ref()
const paginationAnchor = ref()
const paginationVisible = ref(false)

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
