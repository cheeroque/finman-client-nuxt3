<template>
  <div class="container py-8">
    <UiButton variant="secondary" @click="dialogVisible = true"> Show dialog </UiButton>
    &nbsp;
    <UiButton variant="secondary-muted" @click="toastVisible = true"> Show toast </UiButton>
    <UiDialog v-model="dialogVisible" title="Hello too!"> dialog content </UiDialog>
    <UiToast v-model="toastVisible" :autohide="false" message="Toast message" title="Hello!" variant="secondary" />
  </div>
</template>

<script setup>
const dialogVisible = ref(false)
const toastVisible = ref(false)
</script>

<style lang="scss" scoped>
.container {
  background-image: linear-gradient(
    to right,
    transparent 12px,
    var(--grid-color) 12px,
    var(--grid-color) calc(100% - 12px),
    transparent calc(100% - 12px)
  );
  background-position: left center;
  background-repeat: repeat-x;
  background-size: calc((100%) / var(--grid-columns)) 100%;
}

.block {
  height: 200px;
  margin-bottom: 1rem;
  padding: 2rem;
  text-align: center;
  background-color: var(--primary-container);
}
</style>
