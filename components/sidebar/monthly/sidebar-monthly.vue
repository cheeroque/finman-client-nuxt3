<template>
  <SidebarWidget :title="useString('thisMonth')" class="sidebar-widget-monthly">
    <p v-if="isEmpty" class="text-center text-neutral mb-0">
      {{ useString('tableEmpty') }}
    </p>

    <ul class="list-unstyled">
      <li
        v-for="(group, index) in visibleCategories"
        :key="`group-${index}`"
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
      :title="useString(collapseOpen ? 'collapse' : 'expand')"
      :class="{ expanded: collapseOpen }"
      icon="caret"
      icon-size="10"
      variant="primary-muted"
      class="collapse-toggle"
      @click="toggleCollapse"
    />
  </SidebarWidget>
</template>

<script setup lang="ts">
import { RecordsCategory } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

interface CategoryWithTotal {
  category: RecordsCategory
  total: number
}

const VISIBLE_LIMIT = 5

const recordsStore = useRecordsStore()

const collapseOpen = ref(false)

const groupedExpenses = computed(() => {
  const categories: CategoryWithTotal[] = []

  Object.entries(recordsStore.monthRecords ?? {}).forEach(([categoryId, records]) => {
    const category = records?.[0]?.category
    const total = records?.reduce((total, record) => (total += record.sum), 0)

    if (!category.is_income) {
      categories.push({ category, total })
    }
  })

  categories.sort((a, b) => b.total - a.total)

  return categories
})

const visibleCategories = computed(() => groupedExpenses.value.slice(0, VISIBLE_LIMIT))

const hiddenCategories = computed(() => groupedExpenses.value.slice(VISIBLE_LIMIT))

const hasCollapse = computed(() => Boolean(hiddenCategories.value.length))

const isEmpty = computed(() => !groupedExpenses.value.length)

const maxTotal = computed(() => groupedExpenses.value[0].total)

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
