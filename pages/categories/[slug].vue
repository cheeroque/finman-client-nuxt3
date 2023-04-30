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

import RECORDS_QUERY from '@/graphql/Records.gql'

interface CategoryRecordsByMonth {
  [key: string]: TableItem
}

interface RecordsQueryResponse {
  records: RecordsQueryResponseRecords
}

interface RecordsQueryResponseRecords {
  data: RecordsItem[]
  paginatorInfo: PaginatorInfo
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
  throw createError({ statusMessage: 'Not found', statusCode: 404 })
}

const perPage = ref<number>()
const page = ref<number>()
const tableItems = ref<TableItem[]>([])

const totalPages = computed<number>(() => {
  if (!recordsStore.firstRecord?.created_at) return 1

  /* Get total count of months between now and first record, then divide it
   * by months per page */
  const startDate = DateTime.fromFormat(recordsStore.firstRecord.created_at, 'yyyy-LL-dd HH:mm:ss')
  const months = Math.ceil(Math.abs(startDate.diffNow('month').months))

  return Math.ceil(months / (perPage.value ?? 18))
})

async function fetchRecords() {
  perPage.value = Number(route.query.perPage) || 18
  page.value = Number(route.query.page) || 1

  const now = DateTime.now()

  const to = now
    .set({ hour: 0, minute: 0, second: 0, day: 1 })
    .plus({ month: 1 })
    .minus({ month: (page.value - 1) * perPage.value, second: 1 })

  const from = to.minus({ month: perPage.value - 1 }).set({ hour: 0, minute: 0, second: 0, day: 1 })

  const variables = {
    where: {
      AND: [
        { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
        { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
      ],
    },
  }

  recordsStore.pending++

  try {
    const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

    if (error.value) throw error.value

    if (data.value?.records?.data) {
      /* Group records by month */
      const monthGroups: CategoryRecordsByMonth = {}

      data.value.records.data.forEach((record) => {
        const month = DateTime.fromFormat(record.created_at, 'yyyy-LL-dd HH:mm:ss').set({
          hour: 0,
          minute: 0,
          second: 0,
          day: 1,
        })

        const key = month.toFormat('yyyy-LL')
        const group = month.toLocaleString({ month: 'long', year: 'numeric' }, { locale: useLocale() })
        const timestamp = month.valueOf()

        let subtotal = record.sum

        if (!monthGroups[key]) {
          monthGroups[key] = { group, records: [record], subtotal, timestamp }
        } else {
          subtotal += monthGroups[key].records.reduce((acc, cur) => (acc += cur.sum), 0)
          monthGroups[key].subtotal = subtotal
          monthGroups[key].records.push(record)
        }
      })

      tableItems.value = Object.values(monthGroups)
    }
  } catch (error) {}

  recordsStore.pending--
}

watch(
  () => route.query,
  async () => {
    await fetchRecords()
    setTimeout(() => useScrollTo('.page'), 250)
  },
  { immediate: true }
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
