<template>
  <aside class="sidebar">
    <SearchForm class="mb-24" />
    <SidebarMonthly class="mb-24" />
    <Transition name="fade" mode="out-in">
      <SidebarCalendar v-if="showCalendar" />
    </Transition>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const showCalendar = computed(() => route.path !== '/months')
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
