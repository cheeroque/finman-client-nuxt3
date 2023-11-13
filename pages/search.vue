<template>
  <PageContent
    :loading="fetching"
    :title="useString('searchResults', searchQuery)"
    class="overflow-hidden"
    spinner-variant="primary"
  >
    <RecordTable :records="tableItems" />

    <template #footer>
      <div v-if="totalPages > 1">
        <UiPagination :disabled="fetching" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useQuery } from '@urql/vue'

import RECORDS_QUERY from '~/graphql/Records.gql'

const route = useRoute()

const searchQuery = computed(() => route.query.q as string)
const perPage = computed(() => Number(route.query.perPage) || 50)

const variables = computed(() => {
  const column = String(route.query.orderBy ?? 'CREATED_AT')
  const order = String(route.query.order ?? 'DESC')
  const page = Number(route.query.page) || 1

  /* Find records by note */

  const where = {
    OR: [{ column: 'NOTE', operator: 'LIKE', value: `%${searchQuery.value}%` }],
  }

  /* Also find records by exact sum if search query can be cast to number */

  if (!isNaN(Number(searchQuery.value))) {
    where.OR.push({ column: 'SUM', operator: 'EQ', value: searchQuery.value })
  }

  return {
    first: perPage.value,
    orderBy: [{ column, order }],
    page,
    where,
  }
})

const { data: result, fetching } = useQuery({
  query: RECORDS_QUERY,
  variables,
})

const tableItems = computed(() => result.value?.records?.data ?? [])
const totalPages = computed(() => Math.ceil(result.value?.records?.paginatorInfo?.total ?? 0 / perPage.value))
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
