<template>
  <div class="group-table-wrapper">
    <UiTable :fields="fields" :items="items" class="group-table" fixed>
      <template #cell(group)="scope">
        <slot v-bind="scope" name="cell(group)" />
      </template>

      <template #cell(subtotal)="{ detailsVisible, item, toggleDetails, value }">
        <UiButton
          v-if="item.transactions?.length"
          :class="{ collapsed: !detailsVisible }"
          class="btn-details"
          icon="caret"
          icon-size="10"
          block
          icon-right
          @click-native="handleToggleDetails($event, detailsVisible, toggleDetails)"
        >
          <span class="caption">{{ value }}&nbsp;₽</span>
        </UiButton>

        <span v-else class="btn-details">{{ value }}&nbsp;₽</span>
      </template>

      <template #row-details="{ item }">
        <UiTable :fields="detailsFields" :items="item.transactions" fixed hide-thead>
          <template #cell(created_at)="{ value }">
            {{ formatDate(value) }}
          </template>

          <template #cell(sum)="{ value }"> {{ value }}&nbsp;₽ </template>

          <template #cell(note)="{ item, value }">
            <UiButton class="btn-edit" icon="edit-24" icon-size="24" block icon-right @click="handleEdit(item)">
              <span class="caption">{{ value }}</span>
            </UiButton>
          </template>
        </UiTable>
      </template>
    </UiTable>

    <TransactionDialog v-model="dialogVisible" :transaction="currentTransaction" @closed="handleDialogClosed" />
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { TransactionFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'
import type { TableField, TableItem } from '~/types'

type GroupTableProps = {
  groupLabel: string
  items: TableItem[]
}

const props = defineProps<GroupTableProps>()

const currentTransaction = ref<FragmentOf<typeof TransactionFragment>>()
const dialogVisible = ref(false)

const fields = computed<TableField[]>(() => [
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

function formatDate(datestring: string): string {
  return DateTime.fromFormat(datestring, 'yyyy-LL-dd HH:mm:ss').toFormat('dd.LL.yyyy')
}

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

function handleEdit(transaction: FragmentOf<typeof TransactionFragment>) {
  currentTransaction.value = transaction
  dialogVisible.value = true
}

function handleDialogClosed() {
  currentTransaction.value = undefined
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

  :deep(td.cell-details-note) {
    padding: 0;
  }

  :deep(.details-visible) {
    color: var(--secondary-active);
    background-color: var(--secondary-bg);
  }

  :deep(.row-details-content) {
    border-bottom: $border-width * 2 solid var(--secondary-outline);

    .table tbody {
      tr {
        color: var(--on-background);
        background-color: var(--background);

        &:nth-of-type(odd) {
          color: var(--on-surface-variant);
          background-color: var(--surface-variant);
        }
      }
    }
  }
}

.btn-details,
.btn-edit {
  display: flex;
  justify-content: initial;
  padding: $table-padding-y $table-padding-x;
  font-size: inherit;
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
  }

  .caption {
    flex: 1 1 auto;
  }
}

.btn-details {
  font-family: $font-family-alternate;
  font-weight: $font-weight-medium;

  :deep(.nuxt-icon) {
    transform: rotate(0);
    transition: $transition;
    transition-property: transform;
  }

  &:not(:disabled):not(.disabled) {
    &.btn {
      &:hover {
        color: var(--primary);
        background-color: inherit;
      }
    }
  }

  &:not(.collapsed) {
    :deep(.nuxt-icon) {
      transform: rotate(-180deg);
    }
  }
}

.btn-edit {
  font-family: inherit;

  &:not(:disabled):not(.disabled) {
    &:hover {
      color: var(--secondary);
      background-color: inherit;

      :deep(.nuxt-icon) {
        color: var(--secondary);
      }
    }
  }

  :deep(.nuxt-icon) {
    color: var(--secondary-outline);
    transition: $transition;
    transition-property: color;
  }
}

@include media-max-width(lg) {
  .group-table-wrapper {
    border-radius: $card-border-radius;
    background-color: var(--background);
    overflow: hidden;
  }

  .btn-details,
  .btn-edit {
    padding: $table-padding-y * 0.875 $table-padding-x * 0.875;
  }

  .btn-edit {
    :deep(.nuxt-icon) {
      display: none;
    }
  }
}
</style>
