<template>
  <UiDialog
    :model-value="modelValue"
    :title="useString('newSnapshot')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <SnapshotForm v-uid ref="form" @success="handleUpdate($event, close)" />
    </template>

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
const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const toast = useToast()

const form = ref()
const formId = computed(() => form.value?.form.id)

function handleUpdate(snapshot: RecordsSnapshot, callback?: Function) {
  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('snapshotSaved', `#${snapshot?.id}`)
  toast.value.variant = 'success'

  if (typeof callback === 'function') {
    callback()
  }
}
</script>
