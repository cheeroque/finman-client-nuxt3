<template>
  <div class="page-records-header">
    <h1 class="page-records-title">
      <NuxtLink to="/"> {{ useNumberFormat(balance) }}&nbsp;₽ </NuxtLink>
    </h1>
    <PageRecordsNav />
  </div>
</template>

<script setup lang="ts">
import { useRecordsStore } from '@/store/records'

const recordsStore = useRecordsStore()
const balance = recordsStore.balance
</script>

<style lang="scss" scoped>
.page-records-header {
  flex: 1 1 auto;
  text-align: center;
}

.page-records-title {
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
  .page-records-header {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .page-records-title {
    margin-bottom: 0;
  }

  :deep(.nav-page-records) {
    display: none;
  }
}

@include media-min-width(lg) {
  .page-records-title {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@include media-min-width(xxl) {
  .page-records-header {
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .page-records-title {
    padding: 0;
    margin-bottom: 0;
    color: var(--primary-active);
  }

  :deep(.nav-page-records) {
    margin-left: auto;
  }
}
</style>
