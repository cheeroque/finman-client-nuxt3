<template>
  <div class="container py-8">
    <div class="row">
      <div class="col-lg-6 col-offset-lg-3">
        <form @submit.prevent>
          <UiFieldset :disabled="fieldsetDisabled" legend="Sample fieldset">
            <UiFormGroup :valid="false" label="Form group" size="lg" floating-label validated>
              <UiSelect v-model="selectedOption" :options="options">
                <template #option-text="{ option, text }"> Value: {{ option.value }}. Text: {{ text }} </template>
              </UiSelect>
            </UiFormGroup>
            <UiFormGroup label="Valid form group" floating-label valid validated>
              <UiSelect v-model="selectedOption" :options="options" />
            </UiFormGroup>
            <UiFormGroup label="Invalid form group" :valid="false" size="lg" validated>
              <UiInput placeholder="Sample placeholder" />
            </UiFormGroup>
            <UiFormGroup label="Invalid form group" :valid="false" size="lg" validated>
              <UiSelect v-model="selectedOption" :options="options" />
            </UiFormGroup>
            <UiSelect v-model="selectedOption" :options="options" />
          </UiFieldset>
        </form>

        selected: {{ selectedOption }}
      </div>
    </div>
  </div>
</template>

<script setup>
const fieldsetDisabled = ref(false)
const disabled = ref(false)

const options = [
  { value: null, text: 'option null', disabled: true },
  { value: 1, text: 'option 1' },
  { value: 2, text: 'option 2' },
]
const selectedOption = ref(null)
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
