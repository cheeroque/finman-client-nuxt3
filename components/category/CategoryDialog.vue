<template>
  <UiDialog
    :loading="loading"
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
              {{ useString('confirmRemoveCategory', categoryFragment?.name) }}
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
import { readFragment, CategoryFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

type CategoryDialogProps = {
  category?: FragmentOf<typeof CategoryFragment>
  modelValue?: boolean
}

const props = defineProps<CategoryDialogProps>()

const emit = defineEmits(['closed', 'update:modelValue'])

const formId = useId()
const loading = useIsBusy()
const refetchTrigger = useRefetchTrigger()

const deletePending = ref(false)

const categoryFragment = computed(() => readFragment(CategoryFragment, props.category))
const isEdit = computed(() => Boolean(categoryFragment.value?.id))
const dialogTitle = computed(() => useString(isEdit.value ? 'changeCategory' : 'createCategory'))

/* Delete current category by ID. Show toast on success or error */

async function handleCategoryDelete() {
  if (!categoryFragment.value) return

  const { id } = categoryFragment.value

  loading.value = true

  try {
    const { result } = await $fetch('/api/category', { method: 'DELETE', query: { id } })

    if (result) {
      const { id, name } = readFragment(CategoryFragment, result)
      const messageName = name ? `«${name}»` : `#${id}`

      useShowToast({
        message: useString('categoryDeleted', messageName),
        variant: 'danger',
      })

      emit('update:modelValue', false)

      /* Trigger refetch of all globally available data */

      refetchTrigger.value = true
    } else {
      throw new Error()
    }
  } catch (error: any) {
    useShowToast({
      message: error?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  deletePending.value = false
  loading.value = false
}

/* Create new category or update existing, if it's set with prop. Show toast
 * on success or error */

async function handleCategoryUpsert(category: FragmentOf<typeof CategoryFragment>) {
  const method = isEdit.value ? 'PUT' : 'POST'

  const id = categoryFragment.value?.id
  const { color, is_income, name, slug } = readFragment(CategoryFragment, category)
  const query = { color, id, is_income, name, slug }

  loading.value = true

  try {
    const { result } = await $fetch('/api/category', { method, query })

    if (result) {
      const { id, name } = readFragment(CategoryFragment, result)
      const messageName = name ? `«${name}»` : `#${id}`

      useShowToast({ message: useString('categorySaved', messageName) })

      emit('update:modelValue', false)

      /* Trigger refetch of all globally available data */

      refetchTrigger.value = true
    } else {
      throw new Error()
    }
  } catch (error: any) {
    useShowToast({
      message: error?.message ?? useString('error'),
      variant: 'danger',
    })
  }

  loading.value = false
}
</script>
