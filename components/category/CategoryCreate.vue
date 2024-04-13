<template>
  <UiButton class="btn-category-create" icon="edit-24" icon-size="24" variant="tertiary" @click="emit('click')">
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
</style>
