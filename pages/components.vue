<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-4">
        <p>{{ color }}</p>
        <UiFormGroup label="Form group with label">
          <UiInputColor v-model="color" />
        </UiFormGroup>

        <p>{{ datetime }}</p>
        <UiFormGroup label="Form group with label">
          <UiInputDatetime v-model="datetime" />
        </UiFormGroup>

        <UiFormGroup label="Form group with label">
          <UiInputCalc v-model="sum" />
        </UiFormGroup>

        <UiFormGroup label="Form group with large input">
          <UiInputCalc v-model="sum" size="lg" />
        </UiFormGroup>

        <UiFormGroup label="Disabled form group" disabled>
          <UiSelect v-model="selected" :options="options" />
        </UiFormGroup>

        <UiFormGroup label="Valid form group" :state="true">
          <UiSelect v-model="selected" :options="options" />
        </UiFormGroup>

        <UiFormGroup label="Invalid form group" :state="false">
          <UiSelect v-model="selected" :options="options" />
        </UiFormGroup>

        <UiInput :state="false" class="mb-16" />

        <UiInput disabled class="mb-16" />

        <UiInput required />
      </div>
    </div>
  </div>
</template>

<script setup>
const selected = ref(null)
const options = [
  { disabled: true, text: 'Choose one', value: null },
  { text: 'First', value: 1 },
  { text: 'Second', value: 2 },
]
const sum = ref(0)
const datetime = ref(new Date())
const color = ref('#ff0000')
</script>
