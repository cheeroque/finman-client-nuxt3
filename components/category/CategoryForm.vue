<template>
  <form ref="form" class="record-form" @submit.prevent="submitForm">
    <UiFormGroup :invalid-feedback="useFieldErrorMessage(name)" :label="useString('name')" :state="useFieldState(name)">
      <UiInput v-model="name.value.value" name="name" />
    </UiFormGroup>

    <UiFormGroup :invalid-feedback="useFieldErrorMessage(slug)" :label="useString('slug')" :state="useFieldState(slug)">
      <UiInput v-model="slug.value.value" name="slug" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(color)"
      :label="useString('color')"
      :state="useFieldState(color)"
    >
      <UiInputColor v-model="color.value.value" name="color" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(sortOrder)"
      :label="useString('sortOrder')"
      :state="useFieldState(sortOrder)"
    >
      <UiInput v-model="sortOrder.value.value" name="sortOrder" type="number" />
    </UiFormGroup>

    <UiCheckbox v-model="isIncome.value.value" name="isIncome">
      {{ useString('isIncome') }}
    </UiCheckbox>
  </form>
</template>

<script setup lang="ts">
import { number as yupNumber, string as yupString } from 'yup'
import type { Category } from '~/types'

type CategoryFormProps = {
  category?: Category
  edit?: boolean
}

const props = defineProps<CategoryFormProps>()

const emit = defineEmits(['submit'])

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const { handleSubmit, values } = useForm({
  initialValues: {
    color: props.category?.color ?? '#fff',
    isIncome: Boolean(props.category?.isIncome),
    name: props.category?.name ?? '',
    slug: props.category?.slug ?? '',
    sortOrder: props.category?.sortOrder ?? 0,
  },

  validationSchema: {
    color: yupString().required(useString('fieldRequired')),
    name: yupString().required(useString('fieldRequired')),
    slug: yupString().required(useString('fieldRequired')),
    sortOrder: yupNumber().required(useString('fieldRequired')).min(0, useString('fieldMinimumValue', '0')),
  },
})

const color = useField<string>('color')
const isIncome = useField<boolean>('isIncome')
const name = useField<string>('name')
const slug = useField<string>('slug')
const sortOrder = useField<number>('sortOrder')

const submitForm = handleSubmit(() => {
  emit('submit', values)
})
</script>
