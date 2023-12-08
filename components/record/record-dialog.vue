<template>
  <UiDialog
    :loading="recordsStore.loading"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <RecordForm v-uid ref="form" :edit="isEdit" :record="record" @submit="handleRecordUpsert" />

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
          <UiButton variant="danger-muted" block @click="handleRecordDelete">
            {{ useString('remove') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

import RECORD_CREATE_MUTATION from '~/graphql/RecordCreate.gql'
import RECORD_UPDATE_MUTATION from '~/graphql/RecordUpdate.gql'
import RECORD_DELETE_MUTATION from '~/graphql/RecordDelete.gql'

import type { RecordsForm } from './record-form.vue'
import type { RecordsItem } from '~/types'

interface RecordDialogProps {
  modelValue?: boolean
  record?: RecordsItem
}

interface RecordMutationResponse {
  result: RecordsItem
}

const props = defineProps<RecordDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const { $urql } = useNuxtApp()
const authStore = useAuthStore()
const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const form = ref()

const formId = computed(() => form.value?.form.id)
const isEdit = computed(() => Boolean(props.record?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeRecord' : 'createRecord'))

/* Delete current record by ID. Show toast on success or error */

async function handleRecordDelete() {
  if (!props.record) return

  const { id } = props.record

  recordsStore.pending++

  const { data, error } = await $urql.mutation<RecordMutationResponse>(RECORD_DELETE_MUTATION, { id }).toPromise()

  if (data?.result) {
    showToast(useString('recordDeleted', `#${props.record?.id}`), 'danger')
    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  recordsStore.pending--
}

/* Create new records or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleRecordUpsert(formData: RecordsForm) {
  const mutation = isEdit.value ? RECORD_UPDATE_MUTATION : RECORD_CREATE_MUTATION

  const { category_id, created_at, note, sum } = formData
  const variables = {
    data: {
      category: { connect: category_id },
      created_at: DateTime.fromJSDate(created_at).toFormat('yyyy-LL-dd HH:mm:ss'),
      id: props.record?.id,
      note,
      sum,
      user: { connect: authStore.user?.id },
    },
  }

  recordsStore.pending++

  const { data, error } = await $urql.mutation<RecordMutationResponse>(mutation, variables).toPromise()

  if (data?.result) {
    showToast(useString('recordSaved', `#${data.result.id}`), 'success')
    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  recordsStore.pending--
}

function showToast(message: string, variant: string) {
  toast.value.modelValue = true
  toast.value.message = message
  toast.value.variant = variant
}
</script>
