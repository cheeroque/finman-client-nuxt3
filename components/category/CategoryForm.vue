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

    <UiCheckbox v-model="is_income.value.value" name="is_income">
      {{ useString('isIncome') }}
    </UiCheckbox>
  </form>
</template>

<script setup lang="ts">
import { string as yupString } from 'yup'
import { readFragment, CategoryFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

type CategoryFormProps = {
  category?: FragmentOf<typeof CategoryFragment>
  edit?: boolean
}

type CategoryFormValues = {
  color: string
  is_income: boolean
  name: string
  slug: string
}

const props = defineProps<CategoryFormProps>()

const emit = defineEmits(['submit'])

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const categoryFragment = computed(() => readFragment(CategoryFragment, props.category))

const { handleSubmit, values } = useForm<CategoryFormValues>({
  initialValues: {
    color: categoryFragment.value?.color ?? '#fff',
    is_income: Boolean(categoryFragment.value?.is_income),
    name: categoryFragment.value?.name ?? '',
    slug: categoryFragment.value?.slug ?? '',
  },

  validationSchema: {
    color: yupString().required(useString('fieldRequired')),
    name: yupString().required(useString('fieldRequired')),
    slug: yupString().required(useString('fieldRequired')),
  },
})

const color = useField<string>('color')
const is_income = useField<boolean>('is_income')
const name = useField<string>('name')
const slug = useField<string>('slug')

const submitForm = handleSubmit(() => {
  emit('submit', values)
})
</script>
