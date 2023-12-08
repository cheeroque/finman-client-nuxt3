<template>
  <PageContent :title="useString('categories')">
    <div class="categories-grid">
      <CategoryCard
        v-for="category in recordsStore.categories"
        :key="`category-${category.id}`"
        :category="category"
        @edit="handleCategoryEdit(category)"
      />

      <CategoryCreate @click="handleCategoryCreate" />
    </div>

    <CategoryDialog v-model="dialogVisible" :category="currentCategory" @closed="handleDialogClosed" />
  </PageContent>
</template>

<script setup lang="ts">
import { useRecordsStore } from '~/store/records'

import type { RecordsCategory } from '~/types'

const recordsStore = useRecordsStore()

const currentCategory = ref<RecordsCategory>()
const dialogVisible = ref(false)

function handleCategoryCreate() {
  currentCategory.value = undefined
  dialogVisible.value = true
}

function handleCategoryEdit(category: RecordsCategory) {
  currentCategory.value = category
  dialogVisible.value = true
}

function handleDialogClosed() {
  currentCategory.value = undefined
}
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
