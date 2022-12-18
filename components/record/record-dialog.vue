<template>
  <UiDialog
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
import { useRecordsStore } from '~/store/records'

const props = defineProps<{
  modelValue?: boolean
  record?: RecordsItem
}>()

const emit = defineEmits(['closed', 'record:delete', 'record:update', 'update:modelValue'])
const recordsStore = useRecordsStore()

const toast = useToast()

const form = ref()
const formId = computed(() => form.value?.form.id)
const isEdit = computed(() => Boolean(props.record?.id))

const dialogTitle = computed(() => useString(isEdit.value ? 'changeRecord' : 'createRecord'))

function handleRecordUpdate(record: RecordsItem, callback?: Function) {
  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('recordSaved', `#${record?.id}`)
  toast.value.variant = 'success'

  if (typeof callback === 'function') {
    callback()
  }
}

async function handleRecordDelete() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string

  recordsStore.pending = true
  await $fetch<RecordsItem>('/api/data/record', {
    method: 'DELETE',
    headers: { cookie },
    query: { id: props.record?.id },
  })

  /** Refetch stored records */
  await recordsStore.refetchOnRecordsChange()
  recordsStore.pending = false

  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('recordDeleted', `#${props.record?.id}`)
  toast.value.variant = 'danger'

  emit('update:modelValue', false)
}
</script>
