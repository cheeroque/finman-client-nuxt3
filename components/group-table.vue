<template>
  <UiTable :fields="fields" :items="items" class="group-table" fixed>
    <template #cell(subtotal)="{ detailsVisible, toggleDetails, value }">
      <UiButton
        :class="{ collapsed: !detailsVisible }"
        icon="caret"
        icon-size="10"
        class="btn-details"
        block
        icon-right
        @click-native="handleToggleDetails($event, detailsVisible, toggleDetails)"
      >
        <span class="caption">{{ value }}&nbsp;₽</span>
      </UiButton>
    </template>
    <template #row-details="{ item }">
      <UiTable :fields="detailsFields" :items="item.records" hide-thead fixed>
        <template #cell(created_at)="{ value }">
          {{ DateTime.fromISO(value).toFormat('dd.LL.yyyy') }}
        </template>
        <template #cell(sum)="{ value }"> {{ value }}&nbsp;₽ </template>
      </UiTable>
    </template>
  </UiTable>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'
import { ComputedRef } from 'vue'
import { TableField, TableItem } from '~/components/ui/ui-table.vue'

const props = defineProps<{
  groupLabel: string
  items: TableItem[]
}>()

const fields: ComputedRef<TableField[]> = computed(() => [
  {
    key: 'group',
    label: props.groupLabel,
    tdClass: 'cell-group',
    thClass: 'cell-group',
  },
  {
    key: 'subtotal',
    label: useString('sum'),
    tdClass: 'cell-sum',
    thClass: 'cell-sum',
  },
])

const detailsFields = [
  {
    key: 'created_at',
    label: useString('date'),
    tdClass: 'cell-details-group',
    thClass: 'cell-details-group',
  },
  {
    key: 'sum',
    label: useString('sum'),
    tdClass: 'cell-details-sum',
    thClass: 'cell-details-sum',
  },
  {
    key: 'note',
    label: useString('note'),
    tdClass: 'cell-details-note',
    thClass: 'cell-details-note',
  },
]

function handleToggleDetails(event: Event, detailsVisible: boolean, callback: Function) {
  const target = event.target as Element
  const row = target?.closest('tr')
  if (row) {
    if (!detailsVisible) {
      row.classList.add('details-visible')
    } else {
      row.classList.remove('details-visible')
    }
  }
  callback()
}
</script>

<style lang="scss" scoped>
.group-table {
  :deep(.cell-group),
  :deep(.cell-details-group) {
    width: 35%;
  }

  :deep(.cell-sum) {
    width: 65%;
  }

  :deep(td.cell-sum) {
    padding: 0;
  }

  :deep(.cell-details-sum) {
    width: 25%;
  }

  :deep(.cell-details-note) {
    width: 40%;
  }

  :deep(.details-visible) {
    color: var(--secondary-active);
    background-color: var(--secondary-bg);
  }

  :deep(.row-details-content) {
    border-bottom: $border-width solid var(--primary-outline);

    .table tbody {
      tr {
        &:nth-of-type(odd) {
          color: var(--on-surface-variant);
          background-color: var(--surface-variant);
        }
      }
    }
  }
}

.btn-details {
  justify-content: initial;
  padding: $table-padding-y $table-padding-x;
  font-weight: $font-weight-medium;
  text-align: left;
  border-radius: 0;
  border: none;
  color: inherit;
  background-color: inherit;

  &:not(:disabled):not(.disabled) {
    &:focus {
      color: inherit;
      background-color: inherit;
    }

    &:hover {
      color: var(--primary);
      background-color: inherit;
    }
  }

  .caption {
    flex: 1 1 auto;
  }

  :deep(.nuxt-icon) {
    transform: rotate(0);
    transition: $transition;
    transition-property: transform;
  }

  &:not(.collapsed) {
    :deep(.nuxt-icon) {
      transform: rotate(-180deg);
    }
  }
}
</style>
