<template>
  <SidebarWidget :title="useString('calendar')">
    <MonthCalendar :date="activeDate" />
  </SidebarWidget>
</template>

<script setup lang="ts">
const route = useRoute()

const activeDate = computed(() => {
  let date

  const routeDate = route.params.month as string

  if (routeDate) {
    const routeYear = Number(routeDate.split('-')[0])
    const routeMonth = Number(routeDate.split('-')[1])
    date = new Date(routeYear, routeMonth - 1)
  }

  return date
})
</script>

<style lang="scss" scoped>
:deep(.calendar-body) {
  font-size: $font-size-base * 0.875;
}
</style>
