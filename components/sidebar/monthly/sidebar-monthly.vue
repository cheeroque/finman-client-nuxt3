<template>
  <SidebarWidget :title="useString('thisMonth')" class="sidebar-widget-monthly">
    <p v-if="isEmpty" class="text-center text-neutral mb-0">
      {{ useString('tableEmpty') }}
    </p>

    <ul class="list-unstyled">
      <li
        v-for="(group, index) in visibleCategories"
        :key="`group-${group.category.id}`"
        :class="{ 'mt-8': index > 0 }"
        role="presentation"
      >
        <SidebarMonthlyCategory :category="group.category" :max-total="maxTotal" :total="group.total" />
      </li>
    </ul>

    <UiCollapse v-if="hasCollapse" v-model="collapseOpen">
      <ul class="list-unstyled pt-8">
        <li
          v-for="(group, index) in hiddenCategories"
          :key="`group-hidden-${index}`"
          :class="{ 'mt-8': index > 0 }"
          role="presentation"
        >
          <SidebarMonthlyCategory :category="group.category" :max-total="maxTotal" :total="group.total" />
        </li>
      </ul>
    </UiCollapse>

    <UiButton
      v-if="hasCollapse"
      :class="{ expanded: collapseOpen }"
      :title="useString(collapseOpen ? 'collapse' : 'expand')"
      class="collapse-toggle"
      icon="caret"
      icon-size="10"
      variant="primary-muted"
      @click="toggleCollapse"
    />
  </SidebarWidget>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import RECORDS_QUERY from '~/graphql/Records.gql'

import type { RecordsCategory, RecordsItem, RecordsResponse } from '~/types/records'

interface CategoryWithTotal {
  category: RecordsCategory
  total: number
}

const VISIBLE_LIMIT = 5

const { $urql } = useNuxtApp()
const refetchTrigger = useRefetchTrigger()

const collapseOpen = ref(false)

const { data, refresh } = await useAsyncData(async () => {
  const now = DateTime.now()

  const from = now.set({ hour: 0, minute: 0, second: 0, day: 1 })
  const to = from.plus({ month: 1 }).minus({ second: 1 })

  const variables = {
    first: 1000,
    where: {
      AND: [
        { column: 'CREATED_AT', operator: 'GTE', value: from.toFormat('yyyy-LL-dd HH:mm:ss') },
        { column: 'CREATED_AT', operator: 'LTE', value: to.toFormat('yyyy-LL-dd HH:mm:ss') },
      ],
    },
  }

  const { data } = await $urql
    .query<RecordsResponse>(RECORDS_QUERY, variables, { requestPolicy: 'network-only' })
    .toPromise()

  const records = ref(data?.records.data ?? [])

  return reactive({ records })
})

const groups = computed(() =>
  getCategoriesWithSubtotal(data.value?.records)
    .filter((group) => !group.category.is_income)
    .sort((a, b) => b.total - a.total)
)

const visibleCategories = computed(() => groups.value?.slice(0, VISIBLE_LIMIT))
const hiddenCategories = computed(() => groups.value?.slice(VISIBLE_LIMIT))
const hasCollapse = computed(() => Boolean(hiddenCategories.value?.length))
const isEmpty = computed(() => !groups.value?.length)
const maxTotal = computed(() => groups.value?.[0].total)

watch(
  /* Refetch records if external trigger was set to true, then reset trigger */

  () => refetchTrigger.value,

  async (event) => {
    if (event) {
      await refresh()
      refetchTrigger.value = false
    }
  }
)

/* Get an array of records, then return array of all the categories
 * with total sum of their records */

function getCategoriesWithSubtotal(records?: RecordsItem[]): CategoryWithTotal[] {
  const categories: CategoryWithTotal[] = []

  records?.forEach((record: RecordsItem) => {
    const categoryIndex = Number(record.category?.id)

    if (categories[categoryIndex]) {
      categories[categoryIndex].total += record.sum
    } else {
      categories[categoryIndex] = {
        category: record.category,
        total: record.sum ?? 0,
      }
    }
  })

  return categories.filter(Boolean)
}

function toggleCollapse() {
  collapseOpen.value = !collapseOpen.value
}
</script>

<style lang="scss" scoped>
.sidebar-widget-monthly {
  position: relative;

  .collapse-toggle {
    position: absolute;
    right: $card-padding-x;
    bottom: $card-padding-y;
    border-radius: 99rem;

    :deep(.nuxt-icon) {
      transform: rotate(0);
      transition: $transition;
      transition-property: transform;
    }

    &.expanded {
      :deep(.nuxt-icon) {
        transform: rotate(-180deg);
      }
    }
  }
}
</style>
