<template>
  <div>
    <div>
      <UiButton class="test-button" icon="home-24" size="lg" block> test button </UiButton>
      <UiButton :to="{ path: '/' }" class="test-button" icon="home-24" variant="info" icon-right>
        test link button
      </UiButton>
    </div>
    <p></p>
    <div>
      <UiFormGroup>
        <template #legend> Legend </template>
        <template #label> label </template>
        <UiInput v-model="text" />
      </UiFormGroup>
      <UiFormGroup>
        <UiSelect v-model="selected" :options="options" />
      </UiFormGroup>
      <p>{{ text }}</p>
      <p>{{ selected }}</p>
    </div>
  </div>
</template>

<script setup>
const text = ref(null)
const selected = ref(null)
const options = [
  { value: null, text: 'Выберите значение', disabled: true },
  { value: 1, text: 'Значение 1' },
  { value: 2, text: 'Значение 2' },
  { value: 99, text: 'Значение 99' },
]
</script>
