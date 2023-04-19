<template>
  <PageContent :loading="loading" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" @records:update="refresh" />
    <RecordFab :show="!paginationVisible" @records:update="refresh" />

    <template #footer>
      <div ref="paginationAnchor">
        <UiPagination :disabled="loading" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script lang="ts" setup>
import { FetchError } from 'ofetch'
import { useRecordsStore } from '~/store/records'

import RECORDS_QUERY from '@/graphql/Records.gql'

interface OrderByClause {
  column: string
  order: string
}

interface WhereHasConditions {
  column?: string
  operator?: string
  value?: string | number | boolean
}

interface RecordsQueryVariables {
  first: number
  hasCategory?: WhereHasConditions
  orderBy: OrderByClause | OrderByClause[]
  page: number
}

const recordsStore = useRecordsStore()
const route = useRoute()

const first = Number(route.query.perPage) || 50
const orderBy = {
  column: (route.query.orderBy as string) ?? 'CREATED_AT',
  order: (route.query.order as string) ?? 'DESC',
}
const page = Number(route.query.page) || 1
const isIncome = route.params.view === 'income'

const variables: RecordsQueryVariables = {
  first,
  orderBy,
  page,
}

if (route.params.view) {
  variables.hasCategory = {
    column: 'IS_INCOME',
    operator: 'EQ',
    value: isIncome,
  }
}

recordsStore.pending = true

const { data } = await useAsyncQuery(RECORDS_QUERY, variables)

console.log(data)

// const { data, error, pending, refresh } = await useAsyncData(route.fullPath, () =>
//   useApiFetch('/api/data/records', { method: 'GET', query })
// )

// const recordsData = computed(() => data.value as RecordsResponse)
// const records = computed(() => recordsData.value.data)
// const totalPages = computed(() => recordsData.value.total)
// const loading = computed(() => pending.value || recordsStore.pending)

recordsStore.pending = false

if (error.value instanceof FetchError && error.value.status === 401) {
  /* Force logout on auth error */
  // await $auth.logout()
}

watch(
  () => route.query,
  async () => {
    await refresh()
    setTimeout(() => useScrollTo('.page'), 250)
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
  if (!process.client) return

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
:deep(.page-content-body) {
  padding: 0 0 0.5rem;
}

:deep(.page-content-footer) {
  display: flex;
  justify-content: center;
}

@include media-min-width(lg) {
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

@include media-min-width(xxl) {
  :deep(.page-content-header) {
    padding: 1.25rem 1rem;
  }
}
</style>
