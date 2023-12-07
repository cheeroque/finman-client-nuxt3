<template>
  <UiDialog
    :loading="recordsStore.loading"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <template #default="{ close }">
      <CategoryForm v-uid ref="form" :category="category" :edit="isEdit" @submit="handleCategoryUpsert" />
    </template>

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
import { useRecordsStore } from '~/store/records'

import CATEGORY_CREATE_MUTATION from '~/graphql/CategoryCreate.gql'
import CATEGORY_UPDATE_MUTATION from '~/graphql/CategoryUpdate.gql'
import CATEGORY_DELETE_MUTATION from '~/graphql/CategoryDelete.gql'

import type { RecordsCategory } from '~/types/records'

interface CategoryMutationResponse {
  result: RecordsCategory
}

const props = defineProps<{
  category?: RecordsCategory
  modelValue?: boolean
}>()

const emit = defineEmits(['closed', 'update:modelValue'])

const { $urql } = useNuxtApp()
const recordsStore = useRecordsStore()
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

  recordsStore.pending++

  const { data, error } = await $urql.mutation<CategoryMutationResponse>(CATEGORY_DELETE_MUTATION, { id }).toPromise()

  if (data?.result) {
    showToast(useString('categoryDeleted', `#${data.result.id}`), 'danger')
    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } else {
    showToast(error?.message ?? useString('error'), 'danger')
  }

  deletePending.value = false
  recordsStore.pending--
}

/* Create new category or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleCategoryUpsert(category: RecordsCategory) {
  const mutation = isEdit.value ? CATEGORY_UPDATE_MUTATION : CATEGORY_CREATE_MUTATION

  const { color, is_income, name, slug } = category
  const id = props.category?.id

  const variables = { data: { color, id, is_income, name, slug } }

  recordsStore.pending++

  const { data, error } = await $urql.mutation<CategoryMutationResponse>(mutation, variables).toPromise()

  if (data?.result) {
    showToast(useString('categorySaved', `#${category?.id}`), 'success')
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
