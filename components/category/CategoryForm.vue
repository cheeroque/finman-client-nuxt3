<template>
  <form ref="form" class="record-form" @submit.prevent="handleSubmit">
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
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import type { Category } from '~/gen/gql/graphql'

type CategoryForm = Omit<Category, 'color' | 'id'> & {
  color?: string
}

type CategoryFormProps = {
  category?: Category
  edit?: boolean
}

const props = defineProps<CategoryFormProps>()

const emit = defineEmits(['submit'])

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

/* Initialize form values from props category (if set) */

const formData = reactive<CategoryForm>({
  color: props.category?.color ?? '#fff',
  is_income: props.category?.is_income ?? false,
  name: props.category?.name ?? '',
  slug: props.category?.slug ?? '',
})

/* Declare validation rules */

const rules = computed(() => ({
  color: { required: helpers.withMessage(useString('fieldRequired'), required) },
  name: { required: helpers.withMessage(useString('fieldRequired'), required) },
  slug: { required: helpers.withMessage(useString('fieldRequired'), required) },
}))

const v$ = useVuelidate<CategoryForm>(rules, formData, { $lazy: true })

/* Validate form, emit 'submit' with form values on success */

function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    emit('submit', formData)
  }
}
</script>
