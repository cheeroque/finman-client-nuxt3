<template>
  <aside class="sidebar">
    <SearchForm class="mb-24" />
    <SidebarMonthly class="mb-24" />
    <Transition name="fade" mode="out-in">
      <SidebarCalendar v-if="showCalendar" :start-date="startDate" />
    </Transition>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const showCalendar = computed(() => route.path !== '/months')
const startDate = computed(() => {
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
.sidebar {
  display: none;
}

@include media-min-width(lg) {
  .sidebar {
    display: block;
    flex: 0 0 auto;
    width: 360px;
  }
}
</style>
