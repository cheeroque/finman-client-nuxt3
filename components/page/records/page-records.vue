<template>
  <PageContent :loading="pending" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" />

    <template #footer>
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script lang="ts">
import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

export default {
  async setup() {
    const auth = useAuthStore()
    const recordsStore = useRecordsStore()
    const config = useRuntimeConfig()
    const route = useRoute()

    const baseURL = config.public.apiUrl
    const headers = { Authorization: `Bearer ${auth.token}` }

    const viewMode = route.params.view as ViewMode

    function buildRequestParams(): RecordsRequestParams {
      return {
        order: (route.query.order as string) || 'DESC',
        orderBy: (route.query.orderBy as string) || 'created_at',
        page: Number(route.query.page) || 1,
        perPage: Number(route.query.perPage) || 50,
        show: viewMode || null,
      }
    }

    const { data, pending, refresh } = await useFetch<RecordsResponse>('records', {
      baseURL,
      headers,
      query: buildRequestParams(),
    })

    recordsStore.records = data.value?.data || []
    recordsStore.totalPages = data.value?.total || 0

    const records = computed(() => recordsStore.records)
    const totalPages = computed(() => recordsStore.totalPages)

    watch(
      () => route.query.page,
      async () => {
        await refresh()
        setTimeout(() => useScrollTo('.page'), 250)
      }
    )

    return { pending, records, totalPages, viewMode }
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
