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

      <h1 class="h4 card-title">{{ category?.name }}</h1>

      <UiButton
        :aria-label="chartButtonTitle"
        :title="chartButtonTitle"
        class="btn-chart"
        icon="chart-bar-24"
        icon-size="24"
        @click="collapseOpen = !collapseOpen"
      />
    </template>

    <UiCollapse v-model="collapseOpen">
      <div class="pb-12 pb-lg-0">
        <ChartBar
          :data="chartData"
          :label-formatter="formatChartBarLabel"
          :options="chartOptions"
          :responsive-options="chartResponsiveOptions"
        />
      </div>
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

import type { RecordsItem } from '~/types'
import type { ChartBarProps } from '~/components/chart/ChartBar.vue'

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

const chartOptions = { reverseData: true }
const chartResponsiveOptions: ChartBarProps['responsiveOptions'] = [
  [
    'screen and (max-width: 767.99998px)',
    {
      axisX: { offset: 0, showLabel: false },
      axisY: { labelInterpolationFnc: (label) => formatDate(Number(label), 'LL.yy') },
      horizontalBars: true,
      reverseData: false,
    },
  ],
  [
    'screen and (min-width: 768px)',
    {
      axisX: { labelInterpolationFnc: (label) => formatDate(Number(label), 'LL.yyyy') },
      axisY: { offset: 0, showLabel: false },
    },
  ],
]

const collapseOpen = ref(true)

const chartButtonTitle = computed(() => useString(collapseOpen.value ? 'hideChart' : 'showChart'))
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

const chartData = computed(() => {
  const labels: string[] = []
  const dataset: number[] = []

  data.value?.tableItems?.forEach((row) => {
    labels.push(String(row.group))
    dataset.push(row.subtotal)
  })

  return { labels, series: [dataset] }
})

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
      const group = date.valueOf()
      const subtotal = records.reduce((acc, cur) => (acc += cur.sum), 0)

      return { group, subtotal, records }
    }) ?? []
  )
}

function formatDate(timestamp: number, format = 'LLLL yyyy'): string {
  return DateTime.fromMillis(timestamp).toFormat(format, { locale: useLocale() })
}

function formatChartBarLabel(value?: number) {
  return `${useNumberFormat(value)} ₽`
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
