<template>
  <PageContent :loading="loading" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" @records:update="fetchRecords" />

    <RecordFab :show="!paginationVisible" @records:update="fetchRecords" />

    <template #footer>
      <div ref="paginationAnchor" v-if="totalPages > 1">
        <UiPagination :disabled="loading" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { FetchError } from 'ofetch'
import { RecordsItem } from '~~/types/records'
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
  orderBy: OrderByClause[]
  page: number
}

interface RecordsQueryResponse {
  records: RecordsQueryResponseRecords
}

interface RecordsQueryResponseRecords {
  data: RecordsItem[]
  paginatorInfo: PaginatorInfo
}

const loading = useState<boolean>('app-loading', () => false)

let records = reactive<RecordsItem[]>([])
const totalPages = ref<number>(1)

const route = useRoute()
const viewMode = computed<ViewMode>(() => route.params.view as ViewMode)

async function fetchRecords() {
  /** Build query variables */
  const column = (route.query.orderBy as string) ?? 'CREATED_AT'
  const order = (route.query.order as string) ?? 'DESC'
  const first = Number(route.query.perPage) || 50
  const page = Number(route.query.page) || 1

  const variables: RecordsQueryVariables = {
    first,
    orderBy: [{ column, order }],
    page,
  }

  /** Set filter by is_income if needed */
  const isExpense = viewMode.value === 'expense'
  const isIncome = viewMode.value === 'income'

  if (isExpense || isIncome) {
    variables.hasCategory = {
      column: 'IS_INCOME',
      operator: 'EQ',
      value: isIncome,
    }
  }

  /** Fetch records */
  loading.value = true

  const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

  records = data.value?.records?.data ?? []
  totalPages.value = data.value?.records?.paginatorInfo.lastPage ?? 1

  if (error.value?.message === 'Unauthenticated' || (error.value instanceof FetchError && error.value.status === 401)) {
    // Force logout
  }

  loading.value = false
}

watch(
  () => route.query,

  async () => {
    await fetchRecords()
    setTimeout(() => useScrollTo('.page'), 250)
  },
  { immediate: true }
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
