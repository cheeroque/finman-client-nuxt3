<template>
  <aside class="sidebar">
    <SearchForm class="mb-24" />
    <SidebarMonthly class="mb-24" />
    <SidebarCalendar v-if="showCalendar" />
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const showCalendar = route.path !== '/months'
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
