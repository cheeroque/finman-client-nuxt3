<template>
  <div class="transaction-table">
    <div class="transaction-table-head">
      <div class="transaction-table-th transaction-date">
        {{ useString('date') }}
      </div>

      <div class="transaction-table-th transaction-sum">
        {{ useString('sum') }}
      </div>

      <div class="transaction-table-th transaction-category">
        {{ useString('category') }}
      </div>

      <div class="transaction-table-th transaction-note">
        {{ useString('note') }}
      </div>
    </div>

    <div class="transaction-table-body">
      <TransactionCardEmpty v-show="isEmpty" />

      <TransactionCard
        v-for="transaction in transactions"
        :key="`transaction-${readFragment(TransactionFragment, transaction).id}`"
        :transaction="transaction"
        :view-mode="viewMode"
        @edit="handleTransactionEdit(transaction)"
      />
    </div>

    <TransactionDialog v-model="dialogVisible" :transaction="currentTransaction" @closed="handleDialogClosed" />
  </div>
</template>

<script setup lang="ts">
import { readFragment, CategoryFragment, TransactionFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'
import type { ViewMode } from '~/types'

type Transaction = FragmentOf<typeof TransactionFragment> & {
  category?: FragmentOf<typeof CategoryFragment>
}

type TransactionTableProps = {
  transactions?: Transaction[]
  viewMode?: ViewMode
}

const props = defineProps<TransactionTableProps>()

const currentTransaction = ref<Transaction>()
const dialogVisible = ref(false)

const isEmpty = computed(() => !props.transactions?.length)

function handleDialogClosed() {
  currentTransaction.value = undefined
}

function handleTransactionEdit(transaction: Transaction) {
  currentTransaction.value = transaction
  dialogVisible.value = true
}
</script>

<style lang="scss" scoped>
@include media-max-width(lg) {
  .transaction-table-body {
    gap: 0.5rem 0;
  }
}

@include media-max-width(xl) {
  .transaction-table-head {
    display: none;
  }

  .transaction-table-body {
    display: flex;
    flex-direction: column;
  }
}

@include media-min-width(xl) {
  .transaction-table-head {
    display: flex;
    border-bottom: ($border-width * 2) solid var(--primary-outline);
  }

  .transaction-table-th {
    flex: 0 0 auto;
    padding: $table-padding-x $table-padding-x;
    font-family: $font-family-alternate;
    font-weight: $font-weight-medium;
    color: var(--primary);
  }

  :deep(.transaction-date) {
    width: 21%;
  }

  :deep(.transaction-sum) {
    justify-content: flex-end;
    width: 15%;
    text-align: right;
  }

  :deep(.transaction-category) {
    width: 27%;
  }

  :deep(.transaction-note) {
    width: 37%;
  }
}
</style>
