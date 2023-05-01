<template>
  <SidebarWidget :title="useString('thisMonth')" class="sidebar-widget-monthly">
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

const VISIBLE_LIMIT = 5
const recordsStore = useRecordsStore()

const categories = recordsStore.categories
const records = recordsStore.monthRecords

const groupedExpenses = computed(() =>
  Object.keys(records ?? {})
    .map((key) => {
      const category = categories?.find(({ id }) => String(id) === key) as RecordsCategory
      const total = records?.[key].reduce((total, { sum }) => (total += sum), 0)
      return { category, total }
    })
    .sort(({ total: totalA }, { total: totalB }) => totalB - totalA)
    .filter(({ category }) => !Boolean(category?.is_income))
)

const collapseOpen = ref(false)

const visibleCategories = computed(() => groupedExpenses.value.slice(0, VISIBLE_LIMIT))
const hiddenCategories = computed(() => groupedExpenses.value.slice(VISIBLE_LIMIT))
const hasCollapse = Boolean(hiddenCategories.value.length)

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
