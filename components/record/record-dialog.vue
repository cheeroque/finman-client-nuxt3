<template>
  <UiDialog
    :model-value="modelValue"
    :title="useString('changeRecord')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <RecordForm v-uid ref="form" :record="record" @submit="close" />
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
                {{ useString('update') }}
              </UiButton>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-auto order-md-1">
          <UiButton variant="danger-muted" block>
            {{ useString('remove') }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
  record?: RecordsItem
}>()

const emit = defineEmits(['update:modelValue'])

const form = ref()
const formId = computed(() => form?.value?.form.id)
</script>
