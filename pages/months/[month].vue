<template>
  <PageContent :loading="pending" :title="category.name" spinner-variant="primary">
    <GroupTable :group-label="useString('date')" :items="tableItems" :loading="pending" />
    <template #footer>
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

type MonthRecords = {
  [key: string]: RecordsItem[]
}

const route = useRoute()
const recordsStore = useRecordsStore()
// const category = recordsStore.categories.find(({ slug }) => slug === route.params.slug)
// if (!category) {
//   throw createError({ statusMessage: 'Not found', statusCode: 404 })
// }

const { data, pending, refresh } = await useAsyncData(
  `month/${route.params.month}`,
  async () => {
    const headers = useRequestHeaders(['cookie'])
    const cookie = headers.cookie as string

    const perPage = Number(route.query.perPage) || 12
    const period = route.params.month as string
    const fetchOptions = { method: 'GET', headers: { cookie }, query: { period } }

    const { data, total } = await $fetch<MonthRecords>('/api/data/category/month', fetchOptions)

    const tableItems = Object.entries(data)
      .map(([key, value]) => {
        const date = DateTime.fromFormat(key, 'yyyy-LL')
        const timestamp = date.valueOf()
        const group = date.toLocaleString({ month: 'long', year: 'numeric' })
        const subtotal = value?.reduce((total, { sum }) => (total += sum), 0)

        return { group, timestamp, subtotal, records: value }
      })
      .sort(({ timestamp: a }, { timestamp: b }) => b - a)

    const totalPages = Math.ceil(total / perPage)

    return { tableItems, totalPages }
  }
  // { lazy: true }
)

const tableItems = computed(() => data?.value?.tableItems || [])
const totalPages = computed(() => data?.value?.totalPages || 0)

watch(
  () => route.query,
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
  :deep(.page-content-footer) {
    justify-content: flex-end;
  }
}
</style>
