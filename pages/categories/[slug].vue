<template>
  <PageContent :loading="recordsStore.loading" :title="category.name" spinner-variant="primary" class="overflow-hidden">
    <GroupTable :group-label="useString('date')" :items="tableItems" :loading="recordsStore.loading" />

    <template #footer v-if="totalPages > 1">
      <UiPagination :disabled="recordsStore.loading" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { RecordsItem } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

import RECORDS_BY_PERIOD_QUERY from '@/graphql/RecordsByPeriod.gql'

interface RecordsByPeriodQueryResponse {
  records: RecordsByPeriodQueryResponseRecords
}

interface RecordsByPeriodQueryResponseData {
  period: string
  records: RecordsItem[]
}

interface RecordsByPeriodQueryResponseRecords {
  data: RecordsByPeriodQueryResponseData[]
  paginatorInfo: PaginatorInfo
}

interface RecordsByPeriodQueryVariables {
  category_id: number
  first?: number
  page?: number
}

interface TableItem {
  group: string
  records: RecordsItem[]
  subtotal: number
  timestamp: number
}

const route = useRoute()
const recordsStore = useRecordsStore()
const category = recordsStore.categories.find(({ slug }) => slug === route.params.slug)

if (!category) {
  const message = useString('errorMessage404')
  throw createError({ fatal: true, message, statusCode: 404 })
}

const perPage = ref<number>()
const page = ref<number>()
const tableItems = ref<TableItem[]>([])
const totalPages = ref(0)

async function fetchRecords() {
  if (!category) return

  perPage.value = Number(route.query.perPage) || 18
  page.value = Number(route.query.page) || 1

  const variables: RecordsByPeriodQueryVariables = {
    category_id: Number(category.id),
    first: perPage.value,
    page: page.value,
  }

  recordsStore.pending++

  try {
    const { data, error } = await useAsyncQuery<RecordsByPeriodQueryResponse>(RECORDS_BY_PERIOD_QUERY, variables)

    if (error.value) throw error.value

    if (data.value?.records?.data) {
      tableItems.value = data.value.records.data.map(({ period, records }) => {
        const date = DateTime.fromFormat(period, 'yyyy-LL')
        const group = date.toLocaleString({ month: 'long', year: 'numeric' }, { locale: useLocale() })
        const subtotal = records.reduce((acc, cur) => (acc += cur.sum), 0)
        const timestamp = date.valueOf()

        return { group, subtotal, records, timestamp }
      })

      totalPages.value = data.value.records.paginatorInfo.lastPage
    }
  } catch (error) {}

  recordsStore.pending--
}

const { refresh } = await useAsyncData('category-records', () => fetchRecords())

watch(
  () => route.query,
  async () => {
    await refresh()
    setTimeout(() => {
      /* If window is scrolled down (e.g. in mobile) scroll it back to top,
       * otherwise scroll back page element */
      const windowTop = useWindowTop()
      const target = !windowTop ? '.page' : undefined
      useScrollTo(target)
    }, 250)
  }
)
</script>

<style lang="scss" scoped>
:deep(.page-content-body) {
  padding: 0;
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
