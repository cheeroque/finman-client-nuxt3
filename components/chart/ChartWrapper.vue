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

<style lang="scss">
$ct-text-color: var(--neutral);
$ct-text-size: 0.875rem;
$ct-text-line-height: 1.5;

$ct-grid-color: var(--neutral-outline);
$ct-grid-dasharray: 0;

$ct-bar-width: var(--ct-bar-width, 2rem);

$ct-series-names: (a, b, c, d, e, f, g);
$ct-series-colors: (
  var(--primary),
  var(--secondary),
  var(--tertiary),
  var(--neutral),
  var(--neutral-variant),
  var(--danger),
  var(--success)
);

@import 'chartist/dist/index.scss';
</style>
