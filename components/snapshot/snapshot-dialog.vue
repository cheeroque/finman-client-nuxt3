<template>
  <UiDialog
    :loading="loading"
    :model-value="modelValue"
    :title="useString('newSnapshot')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <SnapshotForm v-uid ref="form" @submit="handleSubmit" />

    <template #footer="{ close }">
      <div class="row flex-fill g-8">
        <div class="col-12 col-md-auto order-md-2 ms-md-auto">
          <UiButton :form="formId" type="submit" variant="primary" block>
            {{ useString('save') }}
          </UiButton>
        </div>

        <div class="col-12 col-md-auto order-md-1">
          <UiButton variant="neutral-muted" block @click="close">
            {{ useString('cancel') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import { useRecordsStore } from '~/store/records'
import SNAPSHOT_CREATE_MUTATION from '~/graphql/SnapshotCreate.gql'

import type { RecordsSnapshot } from '~/types/records'

interface SnapshotCreateResponse {
  result: RecordsSnapshot
}

interface SnapshotDialogProps {
  modelValue?: boolean
}

const props = defineProps<SnapshotDialogProps>()

const emit = defineEmits(['success', 'update:modelValue'])

const { $urql } = useNuxtApp()
const recordsStore = useRecordsStore()
const toast = useToast()

const form = ref()
const loading = ref(false)

const formId = computed(() => form.value?.form.id)

/* Create new snapshot. Show toast on success or error */

async function handleSubmit(snapshot: RecordsSnapshot) {
  const { balance, created_at, note } = snapshot
  const variables = { data: { balance, created_at, note } }

  loading.value = true

  const { data, error } = await $urql.mutation<SnapshotCreateResponse>(SNAPSHOT_CREATE_MUTATION, variables).toPromise()

  if (data?.result) {
    recordsStore.snapshot = data.result
    showToast(useString('snapshotSaved', `#${data.result.id}`), 'success')

    emit('update:modelValue', false)
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  loading.value = false
}

function showToast(message: string, variant: string) {
  toast.value.modelValue = true
  toast.value.message = message
  toast.value.variant = variant
}
</script>
