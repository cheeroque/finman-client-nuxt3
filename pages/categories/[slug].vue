<template>
  <PageContent :key="pageKey" :loading="pending" class="overflow-hidden" spinner-variant="primary">
    <template #header>
      <UiButton
        :aria-label="useString('home')"
        :title="useString('home')"
        class="btn-back d-lg-none"
        icon="arrow-left-24"
        icon-size="24"
        to="/"
        variant="link"
      />

      <h1 class="h4 card-title">{{ data?.category.name }}</h1>

      <ChartButton v-model="collapseOpen" />
    </template>

    <UiCollapse v-model="collapseOpen">
      <CategoryChart v-if="data" :data="data?.chartData" class="pb-12 pb-lg-0" />
    </UiCollapse>

    <GroupTable
      v-if="data"
      :key="tableKey"
      :group-label="useString('date')"
      :items="data.tableItems"
      :loading="pending"
    >
      <template #cell(group)="{ value }">
        <span class="text-capitalize d-md-none" v-text="formatDate(value, 'LLL yyyy')" />

        <span class="text-capitalize d-none d-md-inline" v-text="formatDate(value)" />
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

import type { SeriesObjectValue } from 'chartist'
import type { RecordsItem } from '~/types'
import type { TableItem } from '~/components/ui/ui-table.vue'

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

const collapseOpen = ref(false)

const { data, error, pending, refresh } = await useAsyncData(async () => {
  /* Attempt to find category by slug */

  const category = recordsStore.categories.find(({ slug }) => slug === route.params.slug)

  if (!category) {
    const message = useString('errorMessage404')
    throw createError({ fatal: true, message, statusCode: 404 })
  }

  /* Fetch records for selected category & period */

  const variables = {
    category_id: Number(category?.id),
    first: Number(route.query.perPage) || 18,
    page: Number(route.query.page) || 1,
  }

  const { data: recordsData } = await $urql
    .query<RecordsByPeriodQueryResponse>(RECORDS_BY_PERIOD_QUERY, variables)
    .toPromise()

  /* Build table items & chart data from records */

  const dataset: SeriesObjectValue<number>[] = []
  const labels: string[] = []
  const tableItems: TableItem[] = []

  recordsData?.records?.data?.forEach(({ period, records }) => {
    const date = DateTime.fromFormat(period, 'yyyy-LL')
    const group = date.valueOf()
    const subtotal = records.reduce((acc, cur) => (acc += cur.sum), 0)

    dataset.push({ meta: { group }, value: subtotal })
    labels.push(String(group))
    tableItems.push({ group, subtotal, records })
  })

  const chartData = reactive({ labels, series: [dataset] })
  const totalPages = ref(recordsData?.records?.paginatorInfo.lastPage ?? 1)

  return reactive({ category, chartData, tableItems, totalPages })
})

if (error.value) {
  throw error.value
}

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

function formatDate(timestamp: number, format = 'LLLL yyyy'): string {
  return DateTime.fromMillis(timestamp).toFormat(format, { locale: useLocale() })
}
</script>

<style lang="scss" scoped>
.btn-chart {
  align-self: flex-start;
  margin-block: -$border-width;
  margin-left: auto;
  padding: 0.5rem;
}

:deep(.page-content-body) {
  padding: 0;
}

:deep(.page-content-footer) {
  display: flex;
  justify-content: center;
}

@include media-min-width(lg) {
  .btn-chart {
    margin-block: calc(-#{$border-width} - 0.5rem);
  }

  :deep(.page-content-footer) {
    justify-content: flex-end;
  }
}

@include media-max-width(md) {
  :deep(.chart-wrapper) {
    &::before {
      padding-bottom: 250%;
    }
  }
}
</style>
