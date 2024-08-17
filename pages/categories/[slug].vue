<template>
  <PageContent :loading="pending" :title="data?.category.name" class="overflow-hidden" spinner-variant="primary">
    <GroupTable
      v-if="data"
      :key="String(route.query.year)"
      :group-label="useString('date')"
      :items="data.items"
      :loading="pending"
    >
      <template #cell(group)="{ value }">
        <span class="text-capitalize d-md-none" v-text="formatDate(value, true)" />

        <span class="text-capitalize d-none d-md-inline" v-text="formatDate(value)" />
      </template>
    </GroupTable>

    <template #footer v-if="years.length > 1">
      <UiPagination
        :disabled="pending"
        :model-value="currentYear"
        :pages="years"
        :total-pages="years.length"
        hide-prev-next
        no-links
        @update:model-value="handleUpdatePage"
      />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import type { TableItem } from '~/types'

const GROUP_KEY_FORMAT = 'yyyy-LL'

const refetchTrigger = useRefetchTrigger()
const route = useRoute()
const router = useRouter()

/* Paginate data by years, from current year back to the year
 * of the first transaction */
const globalStore = useGlobalStore()
const { startDate } = storeToRefs(globalStore)

const now = computed(() => DateTime.now())
const currentYear = computed(() => Number(route.query.year) || now.value.year)

const years = computed(() => {
  const _years: number[] = []
  for (let year = now.value.year; year >= startDate.value.year; year--) {
    _years.push(year)
  }
  return _years
})

const { data, error, status, refresh } = await useAsyncData(
  route.fullPath,

  async () => {
    const { category, transactions } = await useRequestFetch()('/api/categories/transactions', {
      query: {
        slug: route.params.slug,
        year: route.query.year,
      },
    })

    const items: TableItem[] = []

    /* Get table items. Iterate over all past month of currently selected year.
     * If month has transactions, add it to the table items, otherwise add
     * empty placeholder */
    if (transactions.length) {
      const latestMonth = currentYear.value < now.value.year ? 12 : DateTime.now().month

      for (let month = latestMonth; month >= 1; month--) {
        if (currentYear.value <= startDate.value.year && month < startDate.value.month) {
          break
        }

        const key = DateTime.fromObject({ year: currentYear.value, month }).toFormat(GROUP_KEY_FORMAT)
        const foundMonth = transactions.find(({ group }) => group === key)

        items.push(foundMonth ?? { group: key, subtotal: 0, transactions: [] })
      }
    }

    return { category, items }
  },

  { watch: [() => route.query.year] }
)

if (error.value) {
  showError(error.value)
}

const pending = computed(() => status.value === 'pending')

function formatDate(group: string, short = false): string {
  const monthFormat = short ? 'LLL' : 'LLLL'
  return DateTime.fromFormat(group, GROUP_KEY_FORMAT).toFormat(`${monthFormat} yyyy`, {
    locale: useLocale(),
  })
}

function handleUpdatePage(year: number) {
  return router.push({ query: { year } })
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
