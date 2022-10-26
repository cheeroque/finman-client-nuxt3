<template>
  <PageContent class="page-records">
    <template #header>header</template>

    <RecordTable :records="records" />

    <template #footer>
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/store/records'

const props = defineProps<{
  view?: ViewMode
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
    show: props.view || (route.params.view as ViewMode) || null,
  }
}

const { pending, refresh } = await useAsyncData(() => recordsStore.fetchRecords(buildRequestParams()))

watch(
  () => route.query.page,
  () => refresh()
)
</script>

<style lang="scss" scoped>
.page-records {
  :deep(.page-content-body) {
    padding: 0;
  }

  :deep(.page-content-footer) {
    display: flex;
    justify-content: center;
  }
}

@include media-min-width(lg) {
  .page-records {
    :deep(.page-content-body) {
      padding-bottom: 0.25rem;
    }
    :deep(.page-content-footer) {
      justify-content: flex-end;
    }
  }
}
</style>
