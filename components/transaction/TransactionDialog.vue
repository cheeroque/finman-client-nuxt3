<template>
  <UiDialog
    :loading="loading"
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
import { DateTime } from 'luxon'

import type { Transaction } from '~/gen/gql/graphql'
import type { TransactionFormValues } from '~/types'

type TransactionDialogProps = {
  modelValue?: boolean
  transaction?: Transaction
}

const props = defineProps<TransactionDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const formId = useId()
const loading = useIsBusy()
const refetchTrigger = useRefetchTrigger()
const user = useSession()

const isEdit = computed(() => Boolean(props.transaction?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeTransaction' : 'createTransaction'))

/* Delete current transaction by ID. Show toast on success or error */

async function handleTransactionDelete() {
  if (!props.transaction) return

  const { id } = props.transaction

  loading.value = true

  const { data, error } = await useFetch('/api/transaction', { method: 'DELETE', query: { id } })

  if (data?.value?.result) {
    useShowToast({
      message: useString('transactionDeleted', `#${props.transaction?.id}`),
      variant: 'danger',
    })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  loading.value = false
}

/* Create new transaction or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleTransactionUpsert(formData: TransactionFormValues) {
  const method = isEdit.value ? 'PUT' : 'POST'
  const { category_id, created_at, note, sum } = formData

  const query = {
    category_id,
    created_at: DateTime.fromJSDate(created_at).toFormat('yyyy-LL-dd HH:mm:ss'),
    id: props.transaction?.id,
    note,
    sum,
    user_id: user.value?.id,
  }

  loading.value = true

  const { data, error } = await useFetch('/api/transaction', { method, query })

  if (data.value?.result) {
    useShowToast({ message: useString('transactionSaved', `#${data.value.result.id}`) })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
