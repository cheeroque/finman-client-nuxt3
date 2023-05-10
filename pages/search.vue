<template>
  <PageContent
    :loading="recordsStore.loading"
    :title="useString('searchResults', searchQuery)"
    spinner-variant="primary"
    class="overflow-hidden"
  >
    <RecordTable :records="tableItems" />

    <template #footer>
      <div v-if="totalPages > 1">
        <UiPagination :disabled="recordsStore.loading" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { RecordsItem, RecordsQueryResponse, RecordsQueryVariables } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

import RECORDS_QUERY from '@/graphql/Records.gql'

const route = useRoute()
const recordsStore = useRecordsStore()

const searchQuery = computed(() => route.query.q as string)

const tableItems = ref<RecordsItem[]>([])

const totalPages = ref(1)

async function fetchSearchResults() {
  /** Build query variables */
  const column = (route.query.orderBy as string) ?? 'CREATED_AT'
  const order = (route.query.order as string) ?? 'DESC'
  const first = Number(route.query.perPage) || 50
  const page = Number(route.query.page) || 1

  /* Find records by note */
  const where = {
    OR: [{ column: 'NOTE', operator: 'LIKE', value: `%${searchQuery.value}%` }],
  }

  /* Also find records by exact sum if q can be cast to number */
  if (!isNaN(Number(searchQuery.value))) {
    where.OR.push({ column: 'SUM', operator: 'EQ', value: searchQuery.value })
  }

  const variables: RecordsQueryVariables = {
    first,
    orderBy: [{ column, order }],
    page,
    where,
  }

  try {
    const { data, error } = await useAsyncQuery<RecordsQueryResponse>(RECORDS_QUERY, variables)

    if (error.value) throw error.value

    if (data.value?.records?.data) {
      tableItems.value = data.value.records.data
      totalPages.value = data.value.records.paginatorInfo.lastPage
    }
  } catch (error) {}
}

watch(
  () => route.query,
  async () => {
    await fetchSearchResults()
    setTimeout(() => {
      /* If window is scrolled down (e.g. in mobile) scroll it back to top,
       * otherwise scroll back page element */
      const windowTop = useWindowTop()
      const target = !windowTop ? '.page' : undefined
      useScrollTo(target)
    }, 250)
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
