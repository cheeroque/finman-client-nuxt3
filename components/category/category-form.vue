<template>
  <form ref="form" class="record-form" @submit.prevent="onSubmit">
    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'name')"
      :label="useString('name')"
      :state="useValidationState(v$, 'name')"
    >
      <UiInput v-model="formData.name" name="name" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'slug')"
      :label="useString('slug')"
      :state="useValidationState(v$, 'slug')"
    >
      <UiInput v-model="formData.slug" name="slug" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'color')"
      :label="useString('color')"
      :state="useValidationState(v$, 'color')"
    >
      <UiInputColor v-model="formData.color" name="color" />
    </UiFormGroup>

    <UiCheckbox v-model="formData.is_income" name="is_income">
      {{ useString('isIncome') }}
    </UiCheckbox>
  </form>
</template>

<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { useRecordsStore } from '~/store/records'

import CATEGORY_CREATE_MUTATION from '~/graphql/CategoryCreate.gql'
import CATEGORY_UPDATE_MUTATION from '~/graphql/CategoryUpdate.gql'

import type { RecordsCategory } from '~/types/records'

interface CategoryForm {
  color?: string
  is_income: boolean
  name: string
  slug: string
}

interface CategoryUpsertResponse {
  result: RecordsCategory
}

const props = defineProps<{
  category?: RecordsCategory
  edit?: boolean
}>()

const emit = defineEmits(['success'])

const recordsStore = useRecordsStore()
const refetchTrigger = useRefetchTrigger()

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

/* Initialize form & watch for record changes */
const formData = reactive<CategoryForm>({
  color: '#fff',
  is_income: false,
  name: '',
  slug: '',
})

function initFormData() {
  if (props.edit && props.category) {
    const { color, is_income, name, slug } = props.category

    formData.color = color
    formData.is_income = is_income
    formData.name = name
    formData.slug = slug
  }
}

watchEffect(() => initFormData())

/* Form validation */
const rules = computed(() => ({
  color: { required: helpers.withMessage(useString('fieldRequired'), required) },
  name: { required: helpers.withMessage(useString('fieldRequired'), required) },
  slug: { required: helpers.withMessage(useString('fieldRequired'), required) },
}))

const v$ = useVuelidate<CategoryForm>(rules, formData, { $lazy: true })

/* Submit form */

const { executeMutation } = useMutation<CategoryUpsertResponse>(
  props.edit ? CATEGORY_UPDATE_MUTATION : CATEGORY_CREATE_MUTATION
)

async function onSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const { color, is_income, name, slug } = formData

    const variables = {
      data: {
        color,
        id: props.category?.id,
        is_income,
        name,
        slug,
      },
    }

    recordsStore.pending++

    try {
      const { data } = await executeMutation(variables)

      if (data?.result) {
        emit('success', data.result)

        /** Refetch everything that could change after category upsert */
        refetchTrigger.value = true
        // await Promise.all([
        //   recordsStore.fetchCategories(),
        //   recordsStore.fetchMonthRecords(),
        // ])
      }
    } catch (error: any) {}

    recordsStore.pending--
  }
}
</script>
