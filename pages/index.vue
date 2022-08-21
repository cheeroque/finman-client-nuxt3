<template>
  <div>
    <UiTable :fields="tableFields" :items="tableItems">
      <template #head(total)="{ field, label }"> {{ field.key }} as {{ label }} </template>
      <template #cell(total)="{ detailsVisible, item, toggleDetails }">
        {{ item.col1 * item.col2 }}<br />
        <UiButton @click="toggleDetails"> details: {{ detailsVisible }} </UiButton>
      </template>
    </UiTable>
    <p></p>
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

const tableFields = [
  { key: 'col1', label: 'Column 1' },
  { key: 'col2', label: 'Column 2' },
  { key: 'total', label: 'Column Total', thClass: 'bg-gray', tdClass: 'bg-yellow' },
  { empty: 'empty' },
  'string',
]

const tableItems = [
  { col1: 10, col2: 20 },
  { col1: 3, col2: 7 },
  { col1: 14, col2: 233, string: 'hello world' },
]

function toggleCollapse() {
  collapseVisible.value = !collapseVisible.value
}
</script>

<style lang="scss" scoped>
:deep(.bg-gray) {
  color: white;
  background-color: gray;
}

:deep(.bg-yellow) {
  background-color: yellow;
}
</style>
