<template>
  <tr>
    <td v-for="(field, index) in fields" :key="`cell-${rowIndex}-${index}`" :class="field.tdClass">
      <slot
        :name="`cell(${field.key})`"
        :details-visible="detailsVisible"
        :field="field"
        :index="rowIndex"
        :item="item"
        :toggle-details="toggleDetails"
        :value="item[field.key]"
      >
        {{ item[field.key] }}
      </slot>
    </td>
  </tr>
  <tr v-if="detailsVisible" class="row-details">
    <td :colspan="fields?.length">
      <UiCollapse v-model="collapseVisible" @hidden="onHidden">
        <div style="height: 100px; font-size: 1.5rem; background-color: pink">details</div>
      </UiCollapse>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({
  fields: { type: Array, default: () => [] },
  item: { type: Object, default: () => ({}) },
  rowIndex: Number,
})

const detailsVisible = ref(false)
const collapseVisible = ref(false)

function onHidden() {
  detailsVisible.value = false
}

function toggleDetails() {
  if (detailsVisible.value) {
    collapseVisible.value = false
  } else {
    detailsVisible.value = true
    nextTick(() => (collapseVisible.value = true))
  }
}
</script>
