<template>
  <table class="table">
    <thead v-if="!noHead">
      <tr>
        <th v-for="(field, index) in normalizedFields" :key="`th-${index}`" :class="field.thClass">
          <slot :name="`head(${field.key})`" :column="field.key" :field="field" :label="field.label">
            {{ field.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(row, rowIndex) in items" :key="`row-${rowIndex}`">
        <UiTableRow :fields="normalizedFields" :item="row" :row-index="rowIndex">
          <template v-for="(_, slot) of $slots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </UiTableRow>
      </template>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  fields: { type: Array, default: () => [] },
  items: { type: Array, default: () => [] },
  noHead: Boolean,
})

const normalizedFields = computed(() =>
  props.fields?.map((field) => (typeof field === 'object' ? field : { key: field, label: field }))
)

function getFieldKey(field) {
  return typeof field === 'object' ? field.key : field
}

function getFieldLabel(field) {
  return typeof field === 'object' ? field.label : field
}
</script>
