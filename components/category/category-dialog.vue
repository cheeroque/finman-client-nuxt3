<template>
  <UiDialog
    :loading="pending"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <CategoryForm
        v-uid
        ref="form"
        :category="category"
        :edit="isEdit"
        @success="handleCategoryUpdate($event, close)"
      />
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
          <UiButton variant="danger-muted" block @click="handleCategoryDelete">
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
  category?: RecordsCategory
  modelValue?: boolean
}>()

const emit = defineEmits(['closed', 'category:delete', 'category:update', 'update:modelValue'])
const recordsStore = useRecordsStore()
const pending = computed(() => recordsStore.pending)

const toast = useToast()

const form = ref()
const formId = computed(() => form.value?.form.id)
const isEdit = computed(() => Boolean(props.category?.id))

const dialogTitle = computed(() => useString(isEdit.value ? 'changeCategory' : 'createCategory'))

function handleCategoryUpdate(category: RecordsCategory, callback?: Function) {
  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('categorySaved', `#${category?.id}`)
  toast.value.variant = 'success'

  if (typeof callback === 'function') {
    callback()
  }
}

async function handleCategoryDelete() {
  const headers = useRequestHeaders(['cookie'])
  const cookie = headers.cookie as string

  recordsStore.pending = true
  await $fetch<RecordsCategory>('/api/data/category', {
    method: 'DELETE',
    headers: { cookie },
    query: { id: props.category?.id },
  })

  /** Refetch stored categories */
  await recordsStore.fetchCategories()
  recordsStore.pending = false

  /* Show confirmation toast */
  toast.value.modelValue = true
  toast.value.message = useString('categoryDeleted', `#${props.category?.id}`)
  toast.value.variant = 'danger'

  emit('update:modelValue', false)
}
</script>
