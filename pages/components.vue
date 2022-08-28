<template>
  <div class="container py-8">
    <div class="row">
      <div class="col-2">
        <UiButton icon="home-24" variant="danger" block> Test block button </UiButton>
      </div>
      <div class="col-2">
        <UiButton icon="home-24" variant="danger-outline" block> Test block button </UiButton>
      </div>
      <div class="col-2">
        <UiButton icon="home-24" variant="danger-muted" block> Test block button </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
