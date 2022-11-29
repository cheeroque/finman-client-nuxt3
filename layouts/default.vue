<template>
  <div class="layout-default">
    <NavDrawer :open="drawerOpen" @close="handleCloseDrawer" @toggle="handleToggleDrawer" />

    <div class="app-content">
      <Sidebar />

      <div class="page">
        <slot />
      </div>
    </div>

    <NavBottom @toggle:drawer="handleToggleDrawer" />
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

export default {
  async setup() {
    const auth = useAuthStore()
    const recordsStore = useRecordsStore()
    const config = useRuntimeConfig()

    const baseURL = config.public.apiUrl
    const headers = { Authorization: `Bearer ${auth.token}` }

    if (auth?.token) {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1

      const [
        { data: balance },
        { data: categories },
        { data: firstRecord },
        { data: monthRecords },
        { data: snapshot },
      ] = await Promise.all([
        useFetch<number>('total', { baseURL, headers }),
        useFetch<RecordsCategory[]>('categories', { baseURL, headers }),
        useFetch<RecordsItem>('records/first', { baseURL, headers }),
        useFetch<RecordsItem[]>(`month/${y}-${m}`, { baseURL, headers }),
        useFetch<RecordsSnapshot>('revises/latest', { baseURL, headers }),
      ])
      recordsStore.balance = balance.value || 0
      recordsStore.categories = categories.value || []
      recordsStore.firstRecord = firstRecord.value || {}
      recordsStore.monthRecords = monthRecords.value || []
      recordsStore.snapshot = snapshot.value || {}
    } else {
      auth.logout()
    }

    const drawerOpen = ref(false)

    function handleToggleDrawer(): void {
      drawerOpen.value = !drawerOpen.value
    }

    function handleCloseDrawer(): void {
      drawerOpen.value = false
    }

    return { drawerOpen, handleToggleDrawer, handleCloseDrawer }
  },
}
</script>

<style lang="scss" scoped>
.app-content {
  padding: 0 ($grid-gap * 0.5);
}

@include media-max-width(lg) {
  .layout-default {
    padding-bottom: calc(4rem + 24px);
  }
}

@include media-min-width(lg) {
  .layout-default {
    display: flex;
    height: 100vh;
  }

  .app-content {
    display: flex;
    flex: 1 1 auto;
    align-items: flex-start;
    gap: 0 $grid-gap;
    min-height: 0;
    padding: $grid-gap 0 $grid-gap $grid-gap;
    overflow: hidden;
  }

  .page {
    align-self: stretch;
    width: 100%;
    min-height: 0;
    max-height: 100%;
    padding-right: $grid-gap;
    overflow-y: auto;
  }
}
</style>
