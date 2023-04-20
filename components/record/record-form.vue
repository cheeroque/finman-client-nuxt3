<template>
  <form ref="form" class="record-form" @submit.prevent="onSubmit">
    <UiFormGroup
      :label="useString('category')"
      :invalid-feedback="formatErrors(v$.category_id.$errors)"
      :state="v$.category_id.$error ? false : null"
    >
      <UiSelect v-model="formData.category_id" :options="categoryOptions" name="category_id" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('sum')"
      :invalid-feedback="formatErrors(v$.sum.$errors)"
      :state="v$.sum.$error ? false : null"
    >
      <UiInputCalc v-model="formData.sum" name="sum" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('dateTime')"
      :invalid-feedback="formatErrors(v$.created_at.$errors)"
      :state="v$.created_at.$error ? false : null"
    >
      <UiInputDatetime v-model="formData.created_at" name="created_at" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('note')"
      :invalid-feedback="formatErrors(v$.note.$errors)"
      :state="v$.note.$error ? false : null"
      class="mb-0"
    >
      <UiInput v-model="formData.note" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { ErrorObject, useVuelidate } from '@vuelidate/core'
import { helpers, minValue, required } from '@vuelidate/validators'
import { RecordsItem } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

type RecordsForm = {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}

const props = defineProps<{
  edit?: boolean
  record?: RecordsItem
}>()

const emit = defineEmits(['success'])

const recordsStore = useRecordsStore()
const categories = recordsStore.categories
const categoryOptions = computed(() => categories.map(({ id, name }) => ({ text: name, value: id })))

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

/* Initialize form & watch for record changes */
const formData = reactive<RecordsForm>({
  category_id: categoryOptions.value[0]?.value,
  created_at: new Date(),
  note: undefined,
  sum: 0,
})

function initFormData() {
  if (props.edit) {
    const { category_id, created_at, note, sum } = props.record as RecordsItem

    formData.category_id = category_id
    formData.created_at = DateTime.fromFormat(created_at, 'yyyy-LL-dd HH:mm:ss').toJSDate()
    formData.note = note
    formData.sum = sum
  }
}

initFormData()
watch(
  () => props.record?.id,
  () => {
    initFormData()
  }
)

/* Form validation */
function isValidDate(value: Date): boolean {
  return DateTime.fromJSDate(value).isValid
}

function formatErrors(errors: ErrorObject[]): string {
  return errors.map(({ $message }) => $message).join(' ')
}

const rules = computed(() => ({
  category_id: { required: helpers.withMessage(useString('fieldRequired'), required) },
  created_at: {
    required: helpers.withMessage(useString('fieldRequired'), required),
    isValidDate: helpers.withMessage(useString('invalidDate'), isValidDate),
  },
  note: { required: helpers.withMessage(useString('fieldRequired'), required) },
  sum: {
    minValue: helpers.withMessage(({ $params }) => `${useString('fieldMinimumValue')} ${$params.min}`, minValue(0)),
    required: helpers.withMessage(useString('fieldRequired'), required),
  },
}))

const v$ = useVuelidate<RecordsForm>(rules, formData, { $lazy: true })

/* Submit form */
const pending = computed(() => recordsStore.pending)

async function onSubmit() {
  v$.value.$validate()
  if (!v$.value.$error) {
    const headers = useRequestHeaders(['cookie'])
    const cookie = headers.cookie as string
    const method = props.edit ? 'PUT' : 'POST'

    recordsStore.pending = true
    const record = await $fetch<RecordsItem>('/api/data/record', {
      method,
      body: formData,
      headers: { cookie },
      query: { id: props.record?.id },
    })
    recordsStore.pending = false
    emit('success', record)
  }
}
</script>
