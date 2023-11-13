<template>
  <UiDialog
    :loading="recordsStore.loading"
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

import CATEGORY_DELETE_MUTATION from '~/graphql/CategoryDelete.gql'

import type { RecordsCategory } from '~/types/records'

interface CategoryDeleteResponseData {
  result: CategoryDeleteOutput
}

interface CategoryDeleteOutput {
  id: number
  is_income: boolean
  name: string
  slug: string
}

const props = defineProps<{
  category?: RecordsCategory
  modelValue?: boolean
}>()

const emit = defineEmits(['closed', 'category:delete', 'category:update', 'update:modelValue'])

const recordsStore = useRecordsStore()

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
  if (!props.category) return

  recordsStore.pending++

  const { id } = props.category

  const { mutate } = useMutation<CategoryDeleteResponseData>(CATEGORY_DELETE_MUTATION)

  try {
    const response = await mutate({ id })

    if (response?.data?.result) {
      /* Show confirmation toast */
      toast.value.modelValue = true
      toast.value.message = useString('categoryDeleted', `#${props.category?.id}`)
      toast.value.variant = 'danger'

      emit('update:modelValue', false)

      /** Refetch everything that could change after category delete */
      await Promise.all([
        recordsStore.fetchBalance(),
        recordsStore.fetchCategories(),
        recordsStore.fetchMonthRecords(),
        recordsStore.fetchRecords(),
      ])
    }
  } catch (error: any) {}

  recordsStore.pending--
}
</script>
