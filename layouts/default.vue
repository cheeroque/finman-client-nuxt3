<template>
  <div class="layout-default">
    <div class="app-drawer">
      <nav>app nav</nav>
    </div>
    <div class="app-content">
      <slot />
    </div>
    <div class="app-navigation">
      <NavBottom />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-navigation {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $zindex-dropdown;
}

@include media-max-width(lg) {
  .app-drawer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    transition: $transition;
    transition-property: transform;
  }
}

@include media-min-width(lg) {
  .layout-default {
    display: flex;
    height: 100vh;
  }

  .app-drawer {
    flex: 0 0 auto;
    padding: $grid-gap 0 $grid-gap $grid-gap;
  }

  .app-navigation {
    display: none;
  }

  .app-content {
    flex: 1 1 auto;
    min-height: 0;
    padding: $grid-gap;
    overflow-y: auto;
  }
}
</style>
