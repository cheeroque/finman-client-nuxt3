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
      <UiFormGroup :state="true">
        <template #legend> Legend </template>
        <template #label> label </template>
        <UiInput v-model="text" />
      </UiFormGroup>
      <p>{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
const text = ref(null)
</script>
