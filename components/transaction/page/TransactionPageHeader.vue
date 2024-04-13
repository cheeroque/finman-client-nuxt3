<template>
  <div class="page-transactions-header">
    <h1 class="page-transactions-title">
      <NuxtLink to="/"> {{ useNumberFormat(balance) }}&nbsp;₽ </NuxtLink>
    </h1>

    <TransactionPageNav />
  </div>
</template>

<script setup lang="ts">
const balance = useBalance()
</script>

<style lang="scss" scoped>
.page-transactions-header {
  flex: 1 1 auto;
  text-align: center;
}

.page-transactions-title {
  a {
    transition: $transition;
    transition-property: color;

    &:hover {
      text-decoration: none;
      color: var(--primary);
    }
  }
}

@include media-max-width(lg) {
  .page-transactions-header {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .page-transactions-title {
    margin-bottom: 0;
  }

  :deep(.nav-page-transactions) {
    display: none;
  }
}

@include media-min-width(lg) {
  .page-transactions-title {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@include media-min-width(xxl) {
  .page-transactions-header {
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .page-transactions-title {
    padding: 0;
    margin-bottom: 0;
    color: var(--primary-active);
  }

  :deep(.nav-page-transactions) {
    margin-left: auto;
  }
}
</style>
