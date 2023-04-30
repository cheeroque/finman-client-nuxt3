<template>
  <PageContent :loading="recordsStore.loading" :title="monthName" spinner-variant="primary" class="overflow-hidden">
    <GroupTable :group-label="useString('category')" :items="tableItems" :loading="recordsStore.loading" />
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { RecordsCategory, RecordsItem } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

import CATEGORIES_WITH_RECORDS_QUERY from '@/graphql/CategoriesWithRecords.gql'

interface CategoriesWithRecordsQueryResponse {
  categories: CategoriesWithRecordsQueryResponseCategories
}

interface CategoriesWithRecordsQueryResponseCategories {
  data: CategoryWithRecords[]
}

interface CategoryWithRecords extends RecordsCategory {
  records: RecordsItem[]
  recordsTotal: number
}

interface MonthRecordsGroup {
  category?: RecordsCategory
  group?: string
  records?: RecordsItem[]
  subtotal: number
  trClass?: string
}

const route = useRoute()
const recordsStore = useRecordsStore()

const month = route.params.month as string
const monthName = DateTime.fromFormat(month, 'yyyy-LL').toLocaleString(
  { month: 'long', year: 'numeric' },
  { locale: useLocale() }
)

const tableItems = ref<MonthRecordsGroup[]>([])

async function fetchCategories() {
  const from = DateTime.fromFormat(month, 'yyyy-LL')
  const to = from.plus({ month: 1 }).minus({ second: 1 })

  const where = {
    AND: [
      { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
      { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
    ],
  }

  /* Filter by month is the same for records & recordsTotal, but variable types
   * are different in GQL, so query variables have to be separate */
  const variables = { where, whereTotal: where }

  recordsStore.pending++

  try {
    const { data, error } = await useAsyncQuery<CategoriesWithRecordsQueryResponse>(
      CATEGORIES_WITH_RECORDS_QUERY,
      variables
    )

    if (error.value) throw error.value

    if (data.value?.categories?.data) {
      let balance = 0

      /* Map categories with records to table rows */
      data.value.categories.data.forEach(({ color, id, is_income, name, records, recordsTotal, slug }) => {
        if (is_income) balance += recordsTotal
        else balance -= recordsTotal

        if (recordsTotal) {
          tableItems.value.push({
            category: { color, id, is_income, name, slug },
            group: name,
            records,
            subtotal: recordsTotal,
            trClass: is_income ? 'row-income' : undefined,
          })
        }
      })

      /* Append table row with total balance */
      tableItems.value.push({
        group: useString('monthBalance'),
        subtotal: balance,
        trClass: `row-balance ${balance > 0 ? 'row-balance-positive' : 'row-balance-negative'}`,
      })
    }
  } catch (error) {}

  recordsStore.pending--
}

fetchCategories()
</script>

<style lang="scss" scoped>
:deep(.page-content-body) {
  padding: 0;
}

:deep(.table) {
  .row-income {
    color: var(--on-success-bg);
    background-color: var(--success-bg);

    .btn-details {
      &:not(:disabled):not(.disabled) {
        &:hover {
          color: var(--success-active);
        }
      }
    }

    &.details-visible {
      color: var(--on-success-bg-active);
      background-color: var(--success-bg-active);
    }
  }

  .row-balance {
    font-weight: $font-weight-medium;
    border-top: $border-width solid transparent;
    background-color: var(--background);
  }

  .row-balance-positive {
    color: var(--secondary);
    border-color: var(--secondary-outline);
  }

  .row-balance-negative {
    color: var(--danger);
    border-color: var(--danger-outline);
  }
}
</style>
