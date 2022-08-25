<template>
  <div>
    <UiDatepicker v-model="date" locale="ru" />
    <p>{{ date }}</p>
    <UiDropdown v-model="dropdownVisible">
      <template #toggle="{ hide, show, toggle }">
        <UiButton @click="hide"> Hide dropdown </UiButton>
        <UiButton @click="show"> Show dropdown </UiButton>
        <UiButton @click="toggle"> Toggle dropdown </UiButton>
      </template>
      <p style="height: 200px; margin: 0; background: pink">dropdown content</p>
    </UiDropdown>

    <UiDropdown icon="close-24" text="Dropdown with props" variant="warning" block icon-right>
      <p style="height: 200px; margin: 0; background: cyan">dropdown content</p>
    </UiDropdown>

    <p>This is text under dropdown. It should not move.</p>
  </div>
</template>

<script setup>
const dropdownVisible = ref(false)

const date = ref(new Date(2022, 7, 25))
</script>
