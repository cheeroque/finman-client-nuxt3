<template>
  <aside class="sidebar">
    <SearchForm class="mb-24" />

    <SidebarMonthly class="mb-24" />

    <Transition mode="out-in" name="fade">
      <SidebarCalendar />
    </Transition>
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
