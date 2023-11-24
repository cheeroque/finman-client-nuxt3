<template>
  <UiDialog
    :loading="recordsStore.loading"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <RecordForm v-uid ref="form" :edit="isEdit" :record="record" @success="handleRecordUpdate($event, close)" />
    </template>

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
import { useMutation } from '@urql/vue'
import { useRecordsStore } from '~/store/records'

import RECORD_DELETE_MUTATION from '~/graphql/RecordDelete.gql'

import type { RecordsItem } from '~/types/records'

interface RecordDeleteResponseData {
  result: {
    id: number
    note: string
    sum: number
  }
}

const props = defineProps<{
  modelValue?: boolean
  record?: RecordsItem
}>()

const emit = defineEmits(['closed', 'delete:record', 'update:modelValue', 'update:record'])

const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const { executeMutation } = useMutation<RecordDeleteResponseData>(RECORD_DELETE_MUTATION)

const form = ref()

const formId = computed(() => form.value?.form.id)
const isEdit = computed(() => Boolean(props.record?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeRecord' : 'createRecord'))

async function handleRecordDelete() {
  if (!props.record) return

  recordsStore.pending++

  const { id } = props.record

  try {
    /* Delete record */
    const { data } = await executeMutation({ id })

    if (data?.result) {
      /* Show confirmation toast */
      toast.value.modelValue = true
      toast.value.message = useString('recordDeleted', `#${props.record?.id}`)
      toast.value.variant = 'danger'

      emit('delete:record')
      emit('update:modelValue', false)
    }

    /* Refetch everything that changes after record upsert */
    refetchTrigger.value = true
    // await Promise.all([recordsStore.fetchMonthRecords()])
  } catch (error: any) {}

  recordsStore.pending--
}

function handleRecordUpdate(record: RecordsItem, callback?: Function) {
  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('recordSaved', `#${record?.id}`)
  toast.value.variant = 'success'

  emit('update:record')

  if (typeof callback === 'function') {
    callback()
  }
}
</script>
