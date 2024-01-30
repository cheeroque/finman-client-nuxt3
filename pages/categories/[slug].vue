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
      <template #cell(group)="{ value }">
        <span class="text-capitalize d-md-none" v-text="formatDate(value, true)" />

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

const categories = useCategories()
const refetchTrigger = useRefetchTrigger()
const route = useRoute()

const category = computed(() => categories.value.find(({ slug }) => slug === route.params.slug))

if (!category.value) {
  const message = useString('errorMessage404')
  throw createError({ fatal: true, message, statusCode: 404 })
}

/* Fetch transactions for current category, grouped by period */

const query = computed(() => ({
  category_id: category.value?.id,
  first: route.query.perPage,
  page: route.query.page,
}))

const { data, pending, refresh } = await useFetch('/api/category', {
  query,

  onResponse() {
    setTimeout(() => {
      const windowTop = useWindowTop()
      const target = !windowTop ? '.page' : undefined

      useScrollTo(target)
    }, 100)
  },
})

watch(
  /* Refetch transactions if external trigger was set to true, then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)
/* Key to remount page when pagination appears / disappears */

const pageKey = computed(() => String(Number(data.value?.totalPages) > 1))

/* Key to remount GroupTable when page changes */

const tableKey = computed(() => String(route.query.page))

function formatDate(timestamp: number, short = false): string {
  const monthFormat = short ? 'LLL' : 'LLLL'
  return DateTime.fromMillis(timestamp).toFormat(`${monthFormat} yyyy`, { locale: useLocale() })
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
