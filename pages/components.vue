<template>
  <div class="container" style="--grid-color: rgba(255, 0, 0, 0.15); --grid-columns: 12">
    <div class="row">
      <div class="col-12 col-md-6">
        <h1>col1</h1>
      </div>
      <div class="col-12 col-md-3 col-start-md-9">
        <h1>col2</h1>
      </div>
      <div class="col-12 col-md-8">
        <h1>col3</h1>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row-cols-7">
      <div class="col-lg-2">
        <UiButton block> Test button </UiButton>
      </div>
      <div class="col-lg-2">
        <UiButton variant="primary" size="lg" block> Test LG button </UiButton>
      </div>
      <div class="col-lg-2">
        <UiButton variant="link"> Test link button </UiButton>
      </div>
      <div class="col-lg-2 col-start-lg-1">
        <UiButton v-for="variant in variants" :key="variant" :variant="variant" block>
          {{ variant }}
        </UiButton>
      </div>
      <div class="col-lg-2">
        <UiButton v-for="variant in variants" :key="variant" :variant="`${variant}-muted`" block>
          {{ variant }}-muted
        </UiButton>
      </div>
      <div class="col-lg-2">
        <UiButton v-for="variant in variants" :key="variant" :variant="`${variant}-outline`" block>
          {{ variant }}-outline
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const variants = ['primary', 'secondary', 'tertiary', 'neutral', 'neutral-variant', 'danger', 'success']
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
</style>
