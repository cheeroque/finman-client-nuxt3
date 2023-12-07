<template>
  <PageContent
    :key="pageKey"
    :loading="pending"
    :title="category?.name"
    class="overflow-hidden"
    spinner-variant="primary"
  >
    <GroupTable
      v-if="data"
      :key="tableKey"
      :group-label="useString('date')"
      :items="data.tableItems"
      :loading="pending"
    >
      <template #cell(group)="{ item }">
        <span class="d-md-none" v-text="formatDate(item.timestamp, true)" />

        <span class="d-none d-md-inline" v-text="formatDate(item.timestamp)" />
      </template>
    </GroupTable>

    <template #footer v-if="Number(data?.totalPages) > 1">
      <UiPagination :disabled="pending" :total-pages="data?.totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

import RECORDS_BY_PERIOD_QUERY from '~/graphql/RecordsByPeriod.gql'

import type { RecordsItem } from '~/types/records'

interface RecordsByPeriodQueryResponse {
  records: {
    data: RecordsByPeriodQueryResponseData[]
    paginatorInfo: PaginatorInfo
  }
}

interface RecordsByPeriodQueryResponseData {
  period: string
  records: RecordsItem[]
}

const { $urql } = useNuxtApp()
const route = useRoute()
const recordsStore = useRecordsStore()

const category = computed(() => recordsStore.categories.find(({ slug }) => slug === route.params.slug))

if (!category.value) {
  const message = useString('errorMessage404')
  throw createError({ fatal: true, message, statusCode: 404 })
}

const { data, pending, refresh } = await useAsyncData(async () => {
  const variables = {
    category_id: Number(category.value?.id),
    first: Number(route.query.perPage) || 18,
    page: Number(route.query.page) || 1,
  }

  const { data: recordsData } = await $urql
    .query<RecordsByPeriodQueryResponse>(RECORDS_BY_PERIOD_QUERY, variables)
    .toPromise()

  const tableItems = ref(buildTableItems(recordsData?.records))
  const totalPages = ref(recordsData?.records?.paginatorInfo.lastPage ?? 1)

  return reactive({ tableItems, totalPages })
})

/* Key to remount page when pagination appears / disappears */

const pageKey = computed(() => String(Number(data.value?.totalPages) > 1))

/* Key to remount GroupTable when page changes */

const tableKey = computed(() => String(route.query.page))

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

/* Transform records from response into table rows */

function buildTableItems(records?: RecordsByPeriodQueryResponse['records']) {
  return (
    records?.data.map(({ period, records }) => {
      const date = DateTime.fromFormat(period, 'yyyy-LL')
      const group = date.toLocaleString({ month: 'long', year: 'numeric' }, { locale: useLocale() })
      const subtotal = records.reduce((acc, cur) => (acc += cur.sum), 0)
      const timestamp = date.valueOf()

      return { group, subtotal, records, timestamp }
    }) ?? []
  )
}

function formatDate(timestamp: number, short = false): string {
  const monthFormat = short ? 'LLL' : 'LLLL'
  return DateTime.fromMillis(timestamp).toFormat(`${monthFormat} yyyy`)
}
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
