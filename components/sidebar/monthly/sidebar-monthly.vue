<template>
  <SidebarWidget :title="useString('thisMonth')">
    <ul class="list-unstyled">
      <li
        v-for="(group, index) in groupedExpenses"
        :key="`group-${index}`"
        :class="{ 'mt-8': index > 0 }"
        role="presentation"
      >
        <SidebarMonthlyCategory :category="group.category" :max-total="maxTotal" :total="group.total" />
      </li>
    </ul>
  </SidebarWidget>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/store/records'

const recordsStore = useRecordsStore()

const categories = recordsStore.categories
const records = recordsStore.currentMonthRecords

const groupedExpenses = computed(() =>
  Object.keys(records)
    .map((key) => {
      const category = categories?.find(({ id }) => String(id) === key)
      const total = records[key].reduce((total, { sum }) => (total += sum), 0)
      return { category, total }
    })
    .sort(({ total: totalA }, { total: totalB }) => totalB - totalA)
    .filter(({ category: { is_income } }) => !Boolean(is_income))
)

const maxTotal = computed(() => groupedExpenses.value[0].total)
</script>
