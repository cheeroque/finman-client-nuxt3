<template>
  <PageContent
    :loading="pending"
    :title="useString('searchResults', q)"
    spinner-variant="primary"
    class="overflow-hidden"
  >
    <RecordTable :records="tableItems" />
    <template #footer v-if="totalPages > 1">
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
const route = useRoute()
const q = route.query.q as string

type SearchRequestParams = {
  page?: number
  perPage?: number
  q?: string
}

const { data, pending, refresh } = await useAsyncData(`search/${q}`, async () => {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string

  const perPage = Number(route.query.perPage) || 50
  const query: SearchRequestParams = {
    page: Number(route.query.page) || 1,
    perPage,
    q,
  }
  const fetchOptions = { method: 'GET', headers: { cookie }, query }

  const { data, total } = await $fetch<RecordsResponse>('/api/data/search', fetchOptions)

  const tableItems = data
  const totalPages = Math.ceil(total / perPage)

  return { tableItems, totalPages }
})

const tableItems = computed(() => data?.value?.tableItems || [])
const totalPages = computed(() => data?.value?.totalPages || 0)

watch(
  () => route.query,
  async () => {
    await refresh()
    setTimeout(() => useScrollTo('.page'), 250)
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
