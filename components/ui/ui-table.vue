<template>
  <table :class="tableClasses">
    <thead v-if="!hideThead" class="thead">
      <tr>
        <th v-for="(field, index) in normalizedFields" :key="`th-${index}`" :class="field.thClass">
          <slot :name="`head(${field.key})`" :column="field.key" :field="field" :label="field.label">
            {{ field.label }}
          </slot>
        </th>
      </tr>
    </thead>

    <tbody v-if="isEmpty">
      <tr>
        <td :colspan="fields.length" class="table-empty">
          {{ useString('tableEmpty') }}
        </td>
      </tr>
    </tbody>

    <tbody v-else>
      <template v-for="(row, rowIndex) in items" :key="`row-${rowIndex}`">
        <UiTableRow :fields="normalizedFields" :item="row" :row-index="rowIndex">
          <template v-for="(_, slot) of $slots" #[`${slot}`]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </UiTableRow>
      </template>
    </tbody>
  </table>
</template>

<script setup lang="ts">
export interface TableField {
  key: string
  label?: string
  tdClass?: string
  thClass?: string
}

export interface TableItem {
  [key: string]: any
}

const props = defineProps<{
  fields: TableField[] | string[]
  fixed?: boolean
  hideThead?: boolean
  items: TableItem[]
}>()

const tableClasses = computed(() => {
  const classes = ['table']

  if (props.fixed) {
    classes.push('table-fixed')
  }

  return classes
})

const normalizedFields = computed(() =>
  props.fields.map((field) => ({
    key: getFieldKey(field),
    label: getFieldLabel(field),
    tdClass: typeof field === 'string' ? '' : field.tdClass,
    thClass: typeof field === 'string' ? '' : field.thClass,
  }))
)

const isEmpty = computed(() => !props.items.length)

function getFieldKey(field: string | TableField): string {
  if (typeof field === 'string') return field
  else return field.key
}

function getFieldLabel(field: string | TableField): string {
  if (typeof field === 'string') return field
  else return field.label ?? field.key
}
</script>
