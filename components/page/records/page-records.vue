<template>
  <PageContent :loading="pending" spinner-variant="secondary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" />

    <template #footer>
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/store/records'

const props = defineProps<{
  viewMode?: ViewMode
}>()

const route = useRoute()
const recordsStore = useRecordsStore()
const totalPages = computed(() => recordsStore.records?.last_page)
const records = computed(() => recordsStore.records?.data)

function buildRequestParams(): RecordsRequestParams {
  return {
    order: (route.query.order as string) || 'DESC',
    orderBy: (route.query.orderBy as string) || 'created_at',
    page: Number(route.query.page) || 1,
    perPage: Number(route.query.perPage) || 50,
    show: props.viewMode || null,
  }
}

const { pending, refresh } = await useAsyncData(() => recordsStore.fetchRecords(buildRequestParams()))

watch(
  () => route.query.page,
  async () => {
    await refresh()
    setTimeout(() => useScrollTo('.page'), 250)
  }
)
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
