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
import { readFragment, TransactionFragment, UserFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'
import type { TransactionFormValues } from '~/types'

type TransactionDialogProps = {
  modelValue?: boolean
  transaction?: FragmentOf<typeof TransactionFragment>
}

const props = defineProps<TransactionDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const formId = useId()
const loading = useIsBusy()
const refetchTrigger = useRefetchTrigger()
const user = useSession()

const isEdit = computed(() => Boolean(readFragment(TransactionFragment, props.transaction)?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeTransaction' : 'createTransaction'))

/* Delete current transaction by ID. Show toast on success or error */

async function handleTransactionDelete() {
  if (!props.transaction) return

  const { id } = readFragment(TransactionFragment, props.transaction)

  loading.value = true

  try {
    const { result } = await $fetch('/api/transaction', { method: 'DELETE', query: { id } })

    if (result) {
      useShowToast({
        message: useString('transactionDeleted', `#${readFragment(TransactionFragment, result).id}`),
        variant: 'danger',
      })

      emit('update:modelValue', false)

      /* Trigger refetch of all globally available data */

      refetchTrigger.value = true
    } else {
      throw new Error()
    }
  } catch (error: any) {
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
    id: readFragment(TransactionFragment, props.transaction)?.id,
    note,
    sum,
    user_id: readFragment(UserFragment, user.value)?.id,
  }

  loading.value = true

  try {
    const { result } = await $fetch('/api/transaction', { method, query })

    if (result) {
      useShowToast({ message: useString('transactionSaved', `#${readFragment(TransactionFragment, result).id}`) })

      emit('update:modelValue', false)

      /* Trigger refetch of all globally available data */

      refetchTrigger.value = true
    } else {
      throw new Error()
    }
  } catch (error: any) {
    useShowToast({
      message: error.value?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
