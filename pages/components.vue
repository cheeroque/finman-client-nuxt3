<template>
  <div class="container py-8">
    <div class="row">
      <div class="col-lg-6 col-offset-lg-3">
        <form @submit.prevent>
          <UiFormGroup legend="Sample fieldset">
            <UiFormGroup label="Form group" size="lg">
              <UiInput placeholder="Sample placeholder" />
            </UiFormGroup>
            <UiFormGroup label="Valid form group" size="lg" valid-feedback="Input validated" valid validated>
              <UiInput placeholder="Sample placeholder" />
            </UiFormGroup>
            <UiFormGroup
              label="Invalid form group"
              size="lg"
              invalid-feedback="Please fill this field"
              :valid="false"
              validated
            >
              <UiInput placeholder="Sample placeholder" />
            </UiFormGroup>

            <UiFormGroup size="lg">
              <UiInput placeholder="Large group without label" />
            </UiFormGroup>
          </UiFormGroup>
        </form>
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
