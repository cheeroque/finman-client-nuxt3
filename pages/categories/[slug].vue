<template>
  <PageContent :loading="pending" :title="category.name" spinner-variant="primary" class="overflow-hidden">
    <GroupTable :group-label="useString('date')" :items="tableItems" :loading="pending" />
    <template #footer v-if="totalPages > 1">
      <UiPagination :disabled="pending" :total-pages="totalPages" hide-prev-next />
    </template>
  </PageContent>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { RecordsCategory, RecordsItem } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

type CategoryRecordsByMonth = {
  [key: string]: RecordsItem[]
}

type CategoryRecordsResponse = {
  category?: RecordsCategory
  data: CategoryRecordsByMonth
  total: number
}

type CategoryRecordsRequestParams = {
  id?: number
  order?: string
  orderBy?: string
  page?: number
  perPage?: number
}

const route = useRoute()
const recordsStore = useRecordsStore()
const category = recordsStore.categories.find(({ slug }) => slug === route.params.slug)
if (!category) {
  throw createError({ statusMessage: 'Not found', statusCode: 404 })
}

const { data, pending, refresh } = await useAsyncData(
  `categories/${route.params.slug}/${route.query.page}`,
  async () => {
    const headers = useRequestHeaders(['cookie'])
    const cookie = headers.cookie as string

    const perPage = Number(route.query.perPage) || 12
    const query: CategoryRecordsRequestParams = {
      id: category?.id,
      order: (route.query.order as string) || 'DESC',
      orderBy: (route.query.orderBy as string) || 'created_at',
      page: Number(route.query.page) || 1,
      perPage,
    }
    const fetchOptions = { method: 'GET', headers: { cookie }, query }

    const { data, total } = await $fetch<CategoryRecordsResponse>('/api/data/category/records', fetchOptions)

    const tableItems = Object.entries(data)
      .map(([key, value]) => {
        const date = DateTime.fromFormat(key, 'yyyy-LL')
        const timestamp = date.valueOf()
        const group = date.toLocaleString({ month: 'short', year: 'numeric' }, { locale: useLocale() })
        const subtotal = value?.reduce((total, { sum }) => (total += sum), 0)

        return { group, timestamp, subtotal, records: value }
      })
      .sort(({ timestamp: a }, { timestamp: b }) => b - a)

    const totalPages = Math.ceil(total / perPage)

    return { tableItems, totalPages }
  }
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
  padding: 0;
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
