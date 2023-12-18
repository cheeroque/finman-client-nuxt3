<template>
  <div class="chart-wrapper">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  width: 100%;

  &::before {
    display: block;
    content: '';
    padding-bottom: 56.25%;
  }

  :deep(.chart-container) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
  }
}

@include media-max-width(md) {
  .chart-wrapper {
    &::before {
      padding-bottom: 80%;
    }
  }
}
</style>
