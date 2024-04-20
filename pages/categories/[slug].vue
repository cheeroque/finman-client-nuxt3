<template>
  <PageContent
    :key="pageKey"
    :loading="pending"
    :title="categoryFragment?.name"
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
import { readFragment, CategoryFragment } from '~/graphql'

const categories = useCategories()
const refetchTrigger = useRefetchTrigger()
const route = useRoute()

const category = computed(() =>
  categories.value.find((_category) => {
    const { slug } = readFragment(CategoryFragment, _category)
    return slug === route.params.slug
  })
)

if (!category.value) {
  const message = useString('errorMessage404')
  throw createError({ fatal: true, message, statusCode: 404 })
}

const categoryFragment = computed(() => readFragment(CategoryFragment, category.value))

/* Fetch transactions for current category, grouped by period */

const query = computed(() => ({
  first: route.query.perPage,
  page: route.query.page,
  slug: route.params.slug,
}))

const { data, pending, refresh } = await useFetch('/api/category', {
  query,

  onResponse() {
    setTimeout(() => {
      const windowTop = getWindowTop()
      const target = !windowTop ? '.page' : null

      scrollToEl(target)
    }, 100)
  },

  onResponseError() {
    const message = useString('errorMessage404')

    if (process.client) {
      showError({ message, statusCode: 404 })
    } else {
      throw createError({ fatal: true, message, statusCode: 404 })
    }
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
