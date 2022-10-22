<template>
  <aside class="sidebar">
    <p>search</p>

    <SidebarMonthly class="mb-24" />
    <SidebarCalendar />
  </aside>
</template>

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
