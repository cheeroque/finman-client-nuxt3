<template>
  <UiDialog
    :loading="pending"
    :model-value="modelValue"
    :title="dialogTitle"
    @closed="emit('closed')"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <CategoryForm :category="category" :edit="isEdit" :id="formId" @submit="handleCategoryUpsert" />

    <template #footer="{ close }">
      <Transition mode="out-in" name="fade">
        <div v-if="deletePending" class="row flex-fill g-8">
          <div class="col-12">
            <p class="fs-14 lh-120 text-danger mb-8">
              {{ useString('confirmRemoveCategory', category?.name) }}
            </p>
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
import type { Category, CategoryInsert } from '~/types'

type CategoryReturning = {
  result: {
    id: number
    name: string
  }
}

type CategoryDialogProps = {
  category?: Category
  modelValue?: boolean
}

const props = defineProps<CategoryDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const globalStore = useGlobalStore()
const { pending } = storeToRefs(globalStore)

const formId = useId()
const refetchTrigger = useRefetchTrigger()

const deletePending = ref(false)

const isEdit = computed(() => Boolean(props.category?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeCategory' : 'createCategory'))

/* Delete current category by ID. Show toast on success or error */

async function handleCategoryDelete() {
  if (!props.category) return

  pending.value = true

  try {
    const { result } = await $fetch<CategoryReturning>(`/api/categories/${props.category.id}`, {
      method: 'DELETE',
    })

    const { id, name } = result
    const messageName = name ? `«${name}»` : `#${id}`

    useShowToast({
      message: useString('categoryDeleted', messageName),
      variant: 'danger',
    })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } catch (error: any) {
    useShowToast({
      message: error?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  deletePending.value = false
  pending.value = false
}

/* Create new category or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleCategoryUpsert(category: CategoryInsert) {
  const { color, isIncome, name, slug } = category

  const body = { color, isIncome, name, slug }

  const id = props.category?.id

  pending.value = true

  try {
    const { result } = id ? await updateCategory(body, id) : await createCategory(body)

    const messageName = result.name ? `«${result.name}»` : `#${result.id}`

    useShowToast({ message: useString('categorySaved', messageName) })

    emit('update:modelValue', false)

    /* Trigger refetch of all globally available data */

    refetchTrigger.value = true
  } catch (error: any) {
    useShowToast({
      message: error?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  pending.value = false
}

function createCategory(body: CategoryInsert) {
  return $fetch<CategoryReturning>('/api/categories', { method: 'POST', body })
}

function updateCategory(body: CategoryInsert, id: number) {
  return $fetch<CategoryReturning>(`/api/categories/${id}`, { method: 'PUT', body })
}
</script>
