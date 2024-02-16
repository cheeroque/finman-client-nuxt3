<template>
  <tr :class="item.trClass">
    <td v-for="(field, index) in fields" :key="`cell-${rowIndex}-${index}`" :class="field.tdClass">
      <slot
        :details-visible="detailsVisible"
        :field="field"
        :index="rowIndex"
        :item="item"
        :name="`cell(${field.key})`"
        :toggle-details="handleToggleDetails"
        :value="item[field.key]"
      >
        {{ item[field.key] }}
      </slot>
    </td>
  </tr>

  <tr v-if="detailsVisible" class="row-details">
    <td :colspan="fields?.length">
      <UiCollapse v-model="collapseVisible" @hidden="handleHidden">
        <div class="row-details-content">
          <slot :index="rowIndex" :item="item" :toggle-details="handleToggleDetails" name="row-details" />
        </div>
      </UiCollapse>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { TableField, TableItem } from '~/types'

type TableRowProps = {
  fields: TableField[]
  item: TableItem
  rowIndex?: number
}

const props = defineProps<TableRowProps>()

const detailsVisible = ref(false)
const collapseVisible = ref(false)

function handleHidden() {
  detailsVisible.value = false
}

function handleToggleDetails() {
  if (detailsVisible.value) {
    collapseVisible.value = false
  } else {
    detailsVisible.value = true
    nextTick(() => (collapseVisible.value = true))
  }
}
</script>
