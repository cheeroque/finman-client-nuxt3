<template>
  <PageContent
    :key="totalPages > 1"
    :loading="fetching"
    :title="category.name"
    class="overflow-hidden"
    spinner-variant="primary"
  >
    <GroupTable :group-label="useString('date')" :items="tableItems" :loading="fetching">
      <template #cell(group)="{ item }">
        <span class="d-md-none" v-text="formatDate(item.timestamp, true)" />

        <span class="d-none d-md-inline" v-text="formatDate(item.timestamp)" />
      </template>
    </GroupTable>

    <template #footer v-if="totalPages > 1">
      <UiPagination :disabled="fetching" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useQuery } from '@urql/vue'
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

const route = useRoute()
const recordsStore = useRecordsStore()

const category = computed(() => recordsStore.categories.find(({ slug }) => slug === route.params.slug))

if (!category.value) {
  const message = useString('errorMessage404')
  throw createError({ fatal: true, message, statusCode: 404 })
}

const variables = computed(() => ({
  category_id: Number(category.value?.id),
  first: Number(route.query.perPage) || 18,
  page: Number(route.query.page) || 1,
}))

const { data, executeQuery, fetching } = await useQuery<RecordsByPeriodQueryResponse>({
  query: RECORDS_BY_PERIOD_QUERY,
  variables,
})

const tableItems = computed(
  () =>
    data.value?.records?.data.map(({ period, records }) => {
      const date = DateTime.fromFormat(period, 'yyyy-LL')
      const group = date.toLocaleString({ month: 'long', year: 'numeric' }, { locale: useLocale() })
      const subtotal = records.reduce((acc, cur) => (acc += cur.sum), 0)
      const timestamp = date.valueOf()

      return { group, subtotal, records, timestamp }
    }) ?? []
)

const totalPages = computed(() => data.value?.records.paginatorInfo.lastPage ?? 1)

function formatDate(timestamp: number, short = false): string {
  const monthFormat = short ? 'LLL' : 'LLLL'
  return DateTime.fromMillis(timestamp).toFormat(`${monthFormat} yyyy`)
}

watch(
  () => route.query,

  async () => {
    await executeQuery()

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
