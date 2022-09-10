<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-4 col-offset-4">
        <h1 class="mb-32">{{ datetime.toLocaleString() || 'No datetime set' }}</h1>

        <UiFormGroup label="Datetime picker" floating-label>
          <UiInputDatetime v-model="datetime" />
        </UiFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
const datetime = ref(new Date(2022, 5, 1, 14, 7, 22))
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
