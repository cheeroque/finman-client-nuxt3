<template>
  <div class="container py-8">
    <p>{{ color }}</p>
    <div class="row">
      <div class="col-4">
        <UiFormGroup label="Color picker" floating-label>
          <UiColorpicker v-model="color" :valid="false" validated />
        </UiFormGroup>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <UiFormGroup label="Color picker" size="lg" floating-label>
          <UiColorpicker v-model="color" />
        </UiFormGroup>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <UiFormGroup label="Color picker">
          <UiInputGroup prepend="$" size="lg">
            <UiInput value="9999" />
          </UiInputGroup>
        </UiFormGroup>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <UiInputGroup prepend="$">
          <UiInput value="9999" />
        </UiInputGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
const color = ref(null)
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
