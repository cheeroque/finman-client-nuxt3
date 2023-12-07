<template>
  <PageContent
    :loading="pending"
    :title="useString('searchResults', searchQuery)"
    class="overflow-hidden"
    spinner-variant="primary"
  >
    <RecordTable v-if="data" :records="data.tableItems" />

    <template #footer>
      <div v-if="Number(data?.totalPages) > 1">
        <UiPagination :disabled="pending" :total-pages="data?.totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import RECORDS_QUERY from '~/graphql/Records.gql'

import type { RecordsItem } from '~/types/records'

interface RecordsResponse {
  records: {
    data: RecordsItem[]
    paginatorInfo: PaginatorInfo
  }
}

const { $urql } = useNuxtApp()
const route = useRoute()

const perPage = computed(() => Number(route.query.perPage) || 50)
const searchQuery = computed(() => String(route.query.q))

const { data, pending, refresh } = await useAsyncData(async () => {
  const variables = buildVariables()

  const { data: recordsData } = await $urql.query<RecordsResponse>(RECORDS_QUERY, variables).toPromise()

  const tableItems = ref(recordsData?.records?.data ?? [])
  const totalPages = ref(recordsData?.records?.paginatorInfo?.lastPage ?? 1)

  return reactive({ tableItems, totalPages })
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

function buildVariables() {
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
