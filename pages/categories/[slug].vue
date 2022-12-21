<template>
  <PageContent :loading="pending" :title="useString('category')" spinner-variant="primary">
    <GroupTable :group-label="useString('date')" :items="tableItems" />
    <template #footer>
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

type CategoryRecordsByMonth = {
  [key: string]: RecordsItem[]
}

type CategoryRecordsResponse = {
  category?: RecordsCategory
  data: CategoryRecordsByMonth
  total: number
}

type CategoryRecordsRequestParams = {
  id?: number
  order?: string
  orderBy?: string
  page?: number
  perPage?: number
}

const route = useRoute()
const recordsStore = useRecordsStore()
const category = recordsStore.categories.find(({ slug }) => slug === route.params.slug)
if (!category) {
  throw createError({ statusMessage: 'Not found', statusCode: 404 })
}

const pending = ref(false)
const records = ref<CategoryRecordsByMonth>()
const totalRows = ref(0)
const totalPages = ref(0)

const tableItems = computed(() =>
  Object.entries(records.value as CategoryRecordsByMonth)
    .map(([key, value]) => {
      const date = DateTime.fromFormat(key, 'yyyy-LL')
      const timestamp = date.valueOf()
      const group = date.toLocaleString({ month: 'long', year: 'numeric' })
      const subtotal = value?.reduce((total, { sum }) => (total += sum), 0)

      return { group, timestamp, subtotal, records: value }
    })
    .sort(({ timestamp: a }, { timestamp: b }) => b - a)
)

await fetchCategoryRecords()
watch(
  () => route.query,
  async () => {
    await fetchCategoryRecords()
    setTimeout(() => useScrollTo('.page'), 250)
  }
)

async function fetchCategoryRecords() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string

  const perPage = Number(route.query.perPage) || 12

  const query: CategoryRecordsRequestParams = {
    id: category?.id,
    order: (route.query.order as string) || 'DESC',
    orderBy: (route.query.orderBy as string) || 'created_at',
    page: Number(route.query.page) || 1,
    perPage,
  }

  pending.value = true

  const { data, total } = await $fetch<CategoryRecordsResponse>('/api/data/category/records', {
    method: 'GET',
    headers: { cookie },
    query,
  })

  records.value = data
  totalRows.value = total
  totalPages.value = Math.ceil(total / perPage)
  pending.value = false
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
  :deep(.page-content-footer) {
    justify-content: flex-end;
  }
}
</style>
