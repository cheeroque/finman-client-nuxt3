<template>
  <PageContent :loading="pending" class="page-transactions" spinner-variant="primary">
    <template #header>
      <TransactionPageHeader />
    </template>

    <TransactionTable :transactions="data?.transactions" :view-mode="viewMode" />

    <TransactionFab :show="!paginationVisible" />

    <template #footer>
      <div ref="paginationAnchor" v-if="Number(data?.totalPages) > 1">
        <UiPagination :disabled="pending" :total-pages="data?.totalPages" hide-prev-next />
      </div>
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import type { ViewMode } from '~/types'

const refetchTrigger = useRefetchTrigger()
const route = useRoute()

const observer = ref()
const paginationAnchor = ref()
const paginationVisible = ref(false)

const viewMode = computed<ViewMode>(() => route.params.view as ViewMode)
const query = computed(() => {
  const { page, perPage } = route.query
  return { page, perPage, view: viewMode.value }
})

const { data, pending, refresh } = await useFetch('/api/transactions', {
  query,

  onResponse() {
    setTimeout(() => {
      const windowTop = getWindowTop()
      const target = !windowTop ? '.page' : null

      scrollToEl(target)
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

/* Observe pagination element to hide/show FAB on scroll */

onMounted(() => setObserver())
onUnmounted(() => removeObserver())

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
.page-transactions {
  :deep(.page-content-body) {
    padding: 0 0 0.5rem;
  }

  :deep(.page-content-footer) {
    display: flex;
    justify-content: center;
  }
}

@include media-min-width(lg) {
  .page-transactions {
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
}

@include media-min-width(xxl) {
  .page-transactions {
    :deep(.page-content-header) {
      padding: 1.25rem 1rem;
    }
  }
}
</style>
