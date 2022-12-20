<template>
  <PageContent :title="useString('category')">
    <UiTable :fields="tableFields" :items="tableItems">
      <template #cell(subtotal)="{ toggleDetails, value }">
        <UiButton icon="caret" icon-size="10" block icon-right @click="toggleDetails">
          {{ value }}
        </UiButton>
      </template>
      <template #row-details="{ item }">
        <UiTable :fields="tableDetailsFields" :items="item.records" hide-thead />
      </template>
    </UiTable>
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

type TableItem = {
  period: string
  timestamp: number
  subtotal: number
  records: RecordsItem[]
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

const tableFields = [
  { key: 'period', label: useString('date') },
  { key: 'subtotal', label: useString('sum'), tdClass: 'cell-sum' },
]

const tableDetailsFields = [
  { key: 'created_at', label: useString('date') },
  { key: 'sum', label: useString('sum') },
  { key: 'note', label: useString('note') },
]

const tableItems = computed(() =>
  Object.entries(records.value as CategoryRecordsByMonth)
    .map(([key, value]) => {
      const date = DateTime.fromFormat(key, 'yyyy-LL')
      const timestamp = date.valueOf()
      const period = date.toLocaleString({ month: 'long', year: 'numeric' })
      const subtotal = value?.reduce((total, { sum }) => (total += sum), 0)

      return { period, timestamp, subtotal, records: value }
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

  const query: CategoryRecordsRequestParams = {
    id: category?.id,
    order: (route.query.order as string) || 'DESC',
    orderBy: (route.query.orderBy as string) || 'created_at',
    page: Number(route.query.page) || 1,
    perPage: Number(route.query.perPage) || 12,
  }

  pending.value = true

  const { data, total } = await $fetch<CategoryRecordsResponse>('/api/data/category/records', {
    method: 'GET',
    headers: { cookie },
    query,
  })

  records.value = data
  totalRows.value = total
  pending.value = false
}
</script>
