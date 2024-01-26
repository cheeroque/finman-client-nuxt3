<template>
  <div :style="{ '--icon-bg': String(category.color), '--icon-color': iconColor }" class="card card-category">
    <div class="card-body">
      <NuxtLink :to="`/categories/${category.slug}`" class="h5 card-title">{{ category.name }}</NuxtLink>

      <p class="category-slug">{{ category.slug }}</p>

      <p :class="`category-type-${category.is_income ? 'income' : 'expense'}`" class="category-type">
        {{ useString(category.is_income ? 'incomes' : 'expenses') }}
      </p>
    </div>

    <div class="card-footer">
      <UiButton
        :aria-label="useString('edit')"
        :title="useString('edit')"
        class="category-edit"
        icon="edit-24"
        icon-size="16"
        variant="link"
        @click="emit('edit')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/gen/gql/graphql'

interface CategoryCardProps {
  category: Category
}

const props = defineProps<CategoryCardProps>()

const emit = defineEmits(['edit'])

const iconColor = computed(() => useContrastColor(props.category.color))
</script>

<style lang="scss" scoped>
.card-category {
  flex-direction: row;
  font-size: $font-size-base * 0.875;
}

.card-title {
  font-weight: $font-weight-medium;
}

.card-footer {
  padding: $card-padding-y $card-padding-x $card-padding-y 0;
}

.category-slug {
  margin-bottom: 0;
  color: var(--outline);
}

.category-type {
  margin-bottom: 0;
}

.category-type-expense {
  color: var(--danger);
}

.category-type-income {
  color: var(--success);
}

.category-edit {
  padding: 0.75rem;
  border-radius: 99rem;
  border: none;
  color: var(--icon-color);
  background-color: var(--icon-bg);

  &:not(:disabled):not(.disabled) {
    &:hover {
      text-decoration: none;
      color: var(--on-primary);
      background-color: var(--primary);
    }

    &:focus {
      color: var(--on-primary);
      background-color: var(--primary-active);
    }
  }
}
</style>
