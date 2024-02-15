<template>
  <PageContent
    :loading="pending"
    :title="useString('searchResults', String(route.query.q))"
    class="overflow-hidden"
    spinner-variant="primary"
  >
    <TransactionTable v-if="data" :transactions="data?.transactions" />

    <template #footer>
      <div v-if="Number(data?.totalPages) > 1">
        <UiPagination :disabled="pending" :total-pages="data?.totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
const route = useRoute()

const query = computed(() => {
  const { q, page, perPage } = route.query
  return { q, page, perPage }
})

const { data, pending } = await useFetch('/api/search', {
  query,

  onResponse() {
    setTimeout(() => {
      const windowTop = getWindowTop()
      const target = !windowTop ? '.page' : null

      scrollToEl(target)
    }, 100)
  },
})
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
