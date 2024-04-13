<template>
  <PageContent :title="useString('transactionsCalendar')">
    <MonthCalendar />
  </PageContent>
</template>

<style lang="scss" scoped>
@include media-max-width(lg) {
  :deep(.calendar) {
    padding: $card-padding-y $card-padding-x;
    border-radius: $card-border-radius;
    color: $card-color;
    background-color: $card-bg;
  }

  :deep(.calendar-months) {
    font-size: $font-size-base * 0.875;
  }
}

@include media-min-width(lg) {
  :deep(.calendar-months) {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
