<template>
  <div>
    <UiButton @click="toggleCollapse"> toggle collapse </UiButton>
    <UiCollapse v-model="collapseVisible">
      <template #default="{ close }">
        <div style="height: 500px; background-color: pink">
          <UiButton @click="close"> close </UiButton>
        </div>
      </template>
    </UiCollapse>
    <p></p>
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
      <UiFormGroup legend="Checkbox group">
        <UiCheckbox v-model="checked" value="check 1">Check 1</UiCheckbox>
        <UiCheckbox v-model="checked" value="check 2">Check 2</UiCheckbox>
      </UiFormGroup>
      <UiCheckbox v-model="singleCheck">Single check</UiCheckbox>
      <UiFormGroup legend="Input group">
        <UiInputGroup append="×10 RUR" prepend="Price: ">
          <UiInput v-model="price" type="number" />
        </UiInputGroup>
        <UiInputGroup>
          <template #prepend>
            <strong>Total:</strong>
          </template>
          <UiInput :value="price * 10" />
          <template #append>
            <strong>RUR</strong>
          </template>
        </UiInputGroup>
      </UiFormGroup>
      <p>{{ text }}</p>
      <p>{{ selected }}</p>
      <p>{{ checked }}</p>
      <p>single checkbox is {{ singleCheck ? 'checked' : 'unchecked' }}</p>
    </div>
  </div>
</template>

<script setup>
const collapseVisible = ref(false)
const text = ref(null)
const selected = ref(null)
const options = [
  { value: null, text: 'Выберите значение', disabled: true },
  { value: 1, text: 'Значение 1' },
  { value: 2, text: 'Значение 2' },
  { value: 99, text: 'Значение 99' },
]
const checked = ref(['check 1'])
const singleCheck = ref(true)
const price = ref(null)

function toggleCollapse() {
  collapseVisible.value = !collapseVisible.value
}
</script>
