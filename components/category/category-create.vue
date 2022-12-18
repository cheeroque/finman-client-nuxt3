<template>
  <UiButton icon="edit-24" icon-size="24" variant="tertiary" class="btn-category-create" @click="emit('click')">
    <span class="h5 fw-medium mb-0">{{ useString('addCategory') }}</span>
  </UiButton>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.btn-category-create {
  border: none;
  border-radius: $card-border-radius;
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
