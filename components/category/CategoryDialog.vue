<template>
  <UiDialog
    :loading="transactionsStore.loading"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <CategoryForm v-uid ref="form" :category="category" :edit="isEdit" @submit="handleCategoryUpsert" />

    <template #footer="{ close }">
      <Transition mode="out-in" name="fade">
        <div v-if="deletePending" class="row flex-fill g-8">
          <div class="col-12">
            <p class="fs-14 lh-120 text-danger mb-8">{{ useString('confirmRemoveCategory', category?.name) }}</p>
          </div>

          <div class="col-6 col-md-auto">
            <UiButton variant="success-muted" block @click="deletePending = false">
              {{ useString('cancel') }}
            </UiButton>
          </div>

          <div class="col-6 col-md-auto ms-md-auto">
            <UiButton variant="danger" block @click="handleCategoryDelete">
              {{ useString('confirm') }}
            </UiButton>
          </div>
        </div>

        <div v-else class="row flex-fill g-8">
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
            <UiButton variant="danger-muted" block @click="deletePending = true">
              {{ useString('remove') }}
            </UiButton>
          </div>
        </div>
      </Transition>
    </template>
  </UiDialog>
</template>

<script setup lang="ts">
import { useTransactionsStore } from '~/store/transactions'

import type { Category } from '~/gen/gql/graphql'

interface CategoryDialogProps {
  category?: Category
  modelValue?: boolean
}

const props = defineProps<CategoryDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const transactionsStore = useTransactionsStore()
const refetchTrigger = useRefetchTrigger()
const toast = useToast()

const form = ref()
const deletePending = ref(false)

const formId = computed(() => form.value?.form.id)
const isEdit = computed(() => Boolean(props.category?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeCategory' : 'createCategory'))

/* Delete current category by ID. Show toast on success or error */

async function handleCategoryDelete() {
  if (!props.category) return

  const { id } = props.category

  transactionsStore.pending++

  const { data, error } = await $fetch('/api/category', { method: 'DELETE', query: { id } })

  if (data?.result) {
    showToast(useString('categoryDeleted', `#${data.result.id}`), 'danger')
    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  deletePending.value = false
  transactionsStore.pending--
}

/* Create new category or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleCategoryUpsert(category: Category) {
  const method = isEdit.value ? 'PUT' : 'POST'

  const id = props.category?.id
  const { color, is_income, name, slug } = category
  const query = { color, id, is_income, name, slug }

  transactionsStore.pending++

  const { data, error } = await $fetch('/api/category', { method, query })

  if (data?.result) {
    showToast(useString('categorySaved', `#${category?.id}`), 'success')
    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  transactionsStore.pending--
}

function showToast(message: string, variant: string) {
  toast.value.modelValue = true
  toast.value.message = message
  toast.value.variant = variant
}
</script>
