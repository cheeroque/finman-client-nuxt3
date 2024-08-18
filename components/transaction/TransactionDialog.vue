<template>
  <UiDialog
    :loading="pending"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <TransactionForm :edit="isEdit" :id="formId" :transaction="transaction" @submit="handleTransactionUpsert" />

    <template #footer="{ close }">
      <div class="row flex-fill g-8">
        <div class="col-12 col-md-auto order-md-2 ms-md-auto">
          <div class="row g-8">
            <div class="col-6 d-md-none">
              <UiButton variant="neutral-muted" block @click="close">
                {{ useString('cancel') }}
              </UiButton>
            </div>

            <div class="col-6 col-md-auto">
              <UiButton :form="formId" type="submit" variant="primary" block>
                {{ useString(isEdit ? 'update' : 'save') }}
              </UiButton>
            </div>
          </div>
        </div>

        <div v-if="isEdit" class="col-12 col-md-auto order-md-1">
          <UiButton variant="danger-muted" block @click="handleTransactionDelete">
            {{ useString('remove') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import type { Transaction, TransactionInsert } from '~/types'

type TransactionDialogProps = {
  modelValue?: boolean
  transaction?: Transaction
}

const props = defineProps<TransactionDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const globalStore = useGlobalStore()
const { pending, refreshTrigger } = storeToRefs(globalStore)

const formId = useId()
const user = useUser()

const isEdit = computed(() => Boolean(props.transaction?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeTransaction' : 'createTransaction'))

/* Delete current transaction by ID. Show toast on success or error */
async function handleTransactionDelete() {
  if (!props.transaction) return

  const { id } = props.transaction

  pending.value = true

  try {
    const { result } = await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })

    useShowToast({
      message: useString('transactionDeleted', `#${result.id}`),
      variant: 'danger',
    })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */
    refreshTrigger.value = true
  } catch (error: any) {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  pending.value = false
}

/* Create new transaction or update existing, if it's set with prop. Show toast
 * on success or error */
async function handleTransactionUpsert(transaction: TransactionInsert) {
  const { categoryId, createdAt, note, sum } = transaction
  const userId = user.value?.id

  const body = { categoryId, createdAt, note, sum, userId }

  const id = props.transaction?.id

  pending.value = true

  try {
    const { result } = id ? await updateTransaction(body, id) : await createTransaction(body)

    useShowToast({ message: useString('transactionSaved', `#${result.id}`) })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */
    refreshTrigger.value = true
  } catch (error: any) {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  pending.value = false
}

function createTransaction(body: TransactionInsert) {
  return $fetch('/api/transactions', { method: 'POST', body })
}

function updateTransaction(body: TransactionInsert, id: number) {
  return $fetch(`/api/transactions/${id}`, { method: 'PUT', body })
}
</script>
