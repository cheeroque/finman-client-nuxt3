<template>
  <form ref="form" class="record-form" @submit.prevent="onSubmit">
    <UiFormGroup
      :label="useString('name')"
      :invalid-feedback="formatErrors(v$.name.$errors)"
      :state="v$.name.$error ? false : null"
    >
      <UiInput v-model="formData.name" name="name" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('slug')"
      :invalid-feedback="formatErrors(v$.slug.$errors)"
      :state="v$.slug.$error ? false : null"
    >
      <UiInput v-model="formData.slug" name="slug" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('color')"
      :invalid-feedback="formatErrors(v$.color.$errors)"
      :state="v$.color.$error ? false : null"
    >
      <UiInputColor v-model="formData.color" name="color" />
    </UiFormGroup>
    <UiCheckbox v-model="formData.is_income" :unchecked-value="0" :value="1" name="is_income">
      {{ useString('isIncome') }}
    </UiCheckbox>
  </form>
</template>

<script setup lang="ts">
import { ErrorObject, useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import { RecordsCategory, RecordsItem } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

type CategoryForm = {
  color?: string
  is_income: 0 | 1
  name: string
  slug: string
}

const props = defineProps<{
  category?: RecordsCategory
  edit?: boolean
}>()

const emit = defineEmits(['success'])

const recordsStore = useRecordsStore()

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

/* Initialize form & watch for record changes */
const formData = reactive<CategoryForm>({
  color: '#fff',
  is_income: 0,
  name: '',
  slug: '',
})

function initFormData() {
  if (props.edit) {
    const { color, is_income, name, slug } = props.category as RecordsCategory

    formData.color = color
    formData.is_income = is_income
    formData.name = name
    formData.slug = slug
  }
}

initFormData()
watch(
  () => props.category?.id,
  () => {
    initFormData()
  }
)

/* Form validation */
function formatErrors(errors: ErrorObject[]): string {
  return errors.map(({ $message }) => $message).join(' ')
}

const rules = computed(() => ({
  color: { required: helpers.withMessage(useString('fieldRequired'), required) },
  name: { required: helpers.withMessage(useString('fieldRequired'), required) },
  slug: { required: helpers.withMessage(useString('fieldRequired'), required) },
}))

const v$ = useVuelidate<CategoryForm>(rules, formData, { $lazy: true })

/* Submit form */
const pending = computed(() => recordsStore.pending)

async function onSubmit() {
  v$.value.$validate()
  if (!v$.value.$error) {
    const headers = useRequestHeaders(['cookie'])
    const cookie = headers.cookie as string
    const method = props.edit ? 'PUT' : 'POST'

    recordsStore.pending = true
    const category = await $fetch<RecordsItem>('/api/data/category', {
      method,
      body: formData,
      headers: { cookie },
      query: { id: props.category?.id },
    })

    /** Refetch stored categories */
    await recordsStore.fetchCategories()

    recordsStore.pending = false
    emit('success', category)
  }
}
</script>
