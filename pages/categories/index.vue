<template>
  <PageContent :title="useString('categories')">
    <div class="categories-grid">
      <CategoryCard v-for="category in categories" :key="`category-${category.id}`" :category="category" />
      <CategoryCreate />
    </div>
  </PageContent>
</template>

<script lang="ts" setup>
import { useRecordsStore } from '@/store/records'

const recordsStore = useRecordsStore()
const categories = recordsStore.categories
</script>

<style lang="scss" scoped>
.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

:deep(.btn-category-create) {
  grid-column-start: 1;
  min-height: 5.55rem;
}

@include media-min-width(sm) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $grid-gap;
  }
}

@include media-min-width(lg) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  :deep(.card-category) {
    background-color: var(--surface);
  }
}

@include media-min-width(xl) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@include media-min-width(xxl) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
