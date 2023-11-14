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

const { data: result, executeQuery, fetching } = await useQuery({
  query: RECORDS_QUERY,
  variables,
})

const tableItems = computed(() => result.value?.records?.data ?? [])
const totalPages = computed(() => result.value?.records?.paginatorInfo?.lastPage ?? 1)

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
