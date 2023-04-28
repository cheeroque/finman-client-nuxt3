<template>
  <PageContent :loading="recordsStore.loading" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="recordsStore.records" :view-mode="viewMode" @records:update="recordsStore.fetchRecords" />

    <RecordFab :show="!paginationVisible" @records:update="recordsStore.fetchRecords" />

    <template #footer>
      <div ref="paginationAnchor" v-if="recordsStore.totalPages > 1">
        <UiPagination :disabled="recordsStore.loading" :total-pages="recordsStore.totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useRecordsStore } from '~/store/records'

const recordsStore = useRecordsStore()

const route = useRoute()
const viewMode = computed<ViewMode>(() => route.params.view as ViewMode)

watch(
  () => route.query,

  async () => {
    await recordsStore.fetchRecords()
    setTimeout(() => useScrollTo('.page'), 250)
  },
  { immediate: true }
)

/** Observe pagination element to hide/show FAB on scroll */
onMounted(() => {
  setObserver()
})

onUnmounted(() => {
  removeObserver()
})

const observer = ref()
const paginationAnchor = ref()
const paginationVisible = ref(false)

function setObserver() {
  if (!process.client || !paginationAnchor.value) return

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
