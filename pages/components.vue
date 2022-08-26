<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-6 order-lg-3">
        <div class="block">1</div>
      </div>
      <div class="col-6 col-md-4 col-lg-2 order-lg-2 order-xl-none">
        <div class="block">2</div>
      </div>
      <div class="col-auto col-md-2 order-lg-1 order-xl-none">
        <div class="block">3</div>
      </div>
      <div class="col-sm-6 col-md-8 col-lg-auto col-offset-6 col-offset-lg-8 col-offset-xl-0 order-lg-4">
        <div class="block">4</div>
      </div>
    </div>
    <div class="d-flex px-40 py-24">
      <p class="fs-24 fs-xl-64">spacing test 2</p>
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
