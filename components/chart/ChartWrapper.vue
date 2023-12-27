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
    padding: $card-padding-y $card-padding-x;
    border-radius: $card-border-radius;
    background-color: $card-bg;
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

$ct-bar-width: 0;

@import 'chartist/dist/index.scss';

.ct-bar {
  fill: var(--ct-bar-fill, var(--primary));
}

.ct-bar-label {
  font-family: $font-family-alternate;
  font-size: 0.875rem;
  fill: var(--neutral);
  transform: translateY(-0.5rem);
}

.ct-label {
  font-family: $font-family-alternate;
  font-size: 0.8125rem;
}
</style>
