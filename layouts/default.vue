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
import { useRecordsStore } from '~/store/records'

export default {
  async setup() {
    const recordsStore = useRecordsStore()
    const drawerOpen = ref(false)

    try {
      await fetchGlobalData()
    } catch (e) {
      console.log(e)
    }

    async function fetchGlobalData() {
      const date = new Date()
      const y = date.getFullYear()
      const m = date.getMonth() + 1

      const headers = useRequestHeaders(['cookie'])
      const cookie = headers.cookie as string
      const params = { method: 'GET', headers: { cookie } }

      const [balance, categories, firstRecord, monthRecords, snapshot] = await Promise.all([
        $fetch<number>('/api/data/total', params),
        $fetch<RecordsCategory[]>('/api/data/categories', params),
        $fetch<RecordsItem>('/api/data/records/first', params),
        $fetch<{ [key: string]: RecordsItem[] }>(`/api/data/month/${y}-${m}`, params),
        $fetch<RecordsSnapshot>('/api/data/revises/latest', params),
      ])
      recordsStore.balance = balance || 0
      recordsStore.categories = categories || []
      recordsStore.firstRecord = firstRecord || {}
      recordsStore.monthRecords = monthRecords || {}
      recordsStore.snapshot = snapshot || {}
    }

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
