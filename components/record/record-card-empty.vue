<template>
  <div class="record-card record-card-empty">
    {{ useString('tableEmpty') }}
  </div>
</template>

<style lang="scss" scoped>
.record-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $card-padding-y $card-padding-x;
  font-size: $font-size-base * 0.875;
  text-align: center;
  color: var(--primary-outline);
  background-color: var(--background);
}

@include media-max-width(lg) {
  .record-card {
    border-radius: $card-border-radius;
  }
}

@include media-min-width(xl) {
  .record-card {
    padding: $table-padding-y $table-padding-x;
  }
}
</style>
