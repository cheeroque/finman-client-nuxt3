<template>
  <PageContent :loading="pending" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" />
    <RecordFab :show="!paginationVisible" />

    <template #footer>
      <div ref="paginationAnchor">
        <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script lang="ts">
import { useRecordsStore } from '~/store/records'

export default {
  async setup() {
    /** Lifecycle hooks in async setup should be registered
     ** before first await statement */
    onMounted(() => {
      setObserver()
    })
    onUnmounted(() => {
      removeObserver()
    })

    const recordsStore = useRecordsStore()
    const records = computed(() => recordsStore.records)
    const totalPages = computed(() => recordsStore.totalPages)

    const route = useRoute()
    const viewMode = route.params.view as ViewMode

    const pending = computed(() => recordsStore.pending)

    await recordsStore.fetchRecordsData()
    watch(
      () => route.query,
      async () => {
        await recordsStore.fetchRecordsData()
        setTimeout(() => useScrollTo('.page'), 250)
      }
    )

    /** Observe pagination element to hide/show FAB on scroll */
    const observer = ref()
    const paginationAnchor = ref()
    const paginationVisible = ref(false)

    function setObserver() {
      if (!process.client) return

      if ('IntersectionObserver' in window) {
        observer.value = new IntersectionObserver(([{ isIntersecting }]) => {
          paginationVisible.value = isIntersecting
        })
        observer.value.observe(paginationAnchor.value)
      }
    }

    function removeObserver() {
      if (paginationAnchor.value && observer.value instanceof IntersectionObserver) {
        observer.value.unobserve(paginationAnchor.value)
      }
    }

    return { paginationAnchor, paginationVisible, pending, records, totalPages, viewMode }
  },
}
</script>

<style lang="scss" scoped>
:deep(.page-content-body) {
  padding: 0 0 0.5rem;
}

:deep(.page-content-footer) {
  display: flex;
  justify-content: center;
}

@include media-min-width(lg) {
  :deep(.page-content-header) {
    padding: 1.25rem 0 0;
  }

  :deep(.page-content-body) {
    padding: 0;
  }

  :deep(.page-content-footer) {
    justify-content: flex-end;
  }
}

@include media-min-width(xxl) {
  :deep(.page-content-header) {
    padding: 1.25rem 1rem;
  }
}
</style>
