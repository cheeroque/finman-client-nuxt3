<template>
  <SidebarWidget :title="useString('calendar')">
    <MonthCalendar :date="startDate" />
  </SidebarWidget>
</template>

<script setup lang="ts">
const props = defineProps<{
  startDate?: Date
}>()
</script>

<style lang="scss" scoped>
:deep(.calendar-body) {
  font-size: $font-size-base * 0.875;
}
</style>
