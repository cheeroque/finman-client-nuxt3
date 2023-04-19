<template>
  <PageContent :loading="loading" spinner-variant="primary" class="page-records">
    <template #header>
      <PageRecordsHeader />
    </template>

    <RecordTable :records="records" :view-mode="viewMode" @records:update="refresh" />
    <RecordFab :show="!paginationVisible" @records:update="refresh" />

    <template #footer>
      <div ref="paginationAnchor">
        <UiPagination :disabled="loading" :total-pages="totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script lang="ts" setup>
import { FetchError } from 'ofetch'
import { useRecordsStore } from '~/store/records'

const { $auth } = useNuxtApp()
const recordsStore = useRecordsStore()

const route = useRoute()
const viewMode = route.params.view as ViewMode

const query: RecordsRequestParams = {
  order: (route.query.order as string) || 'DESC',
  orderBy: (route.query.orderBy as string) || 'created_at',
  page: Number(route.query.page) || 1,
  perPage: Number(route.query.perPage) || 50,
  show: viewMode || null,
}

recordsStore.pending = true

const { data, error, pending, refresh } = await useAsyncData(route.fullPath, () =>
  useApiFetch('/api/data/records', { method: 'GET', query })
)

const recordsData = computed(() => data.value as RecordsResponse)
const records = computed(() => recordsData.value.data)
const totalPages = computed(() => recordsData.value.total)
const loading = computed(() => pending.value || recordsStore.pending)

recordsStore.pending = false

if (error.value instanceof FetchError && error.value.status === 401) {
  /* Force logout on auth error */
  // await $auth.logout()
}

watch(
  () => route.query,
  async () => {
    await refresh()
    setTimeout(() => useScrollTo('.page'), 250)
  }
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
