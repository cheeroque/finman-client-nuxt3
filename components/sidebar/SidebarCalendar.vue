<template>
  <SidebarWidget :title="useString('calendar')">
    <MonthCalendar :date="activeDate" />
  </SidebarWidget>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

const route = useRoute()

const activeDate = computed(() => {
  let date

  const routeDate = route.params.month ? String(route.params.month) : undefined

  if (routeDate) {
    date = DateTime.fromFormat(routeDate, 'yyyy-LL').toJSDate()
  }

  return date
})
</script>

<style lang="scss" scoped>
:deep(.calendar-body) {
  font-size: $font-size-base * 0.875;
}
</style>
