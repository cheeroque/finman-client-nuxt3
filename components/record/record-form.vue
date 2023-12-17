<template>
  <form ref="form" class="record-form" @submit.prevent="handleSubmit">
    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'category_id')"
      :label="useString('category')"
      :state="useValidationState(v$, 'category_id')"
    >
      <UiSelect v-model="formData.category_id" :options="categories" name="category_id" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'sum')"
      :label="useString('sum')"
      :state="useValidationState(v$, 'sum')"
    >
      <UiInputCalc v-model="formData.sum" name="sum" autofocus />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'note')"
      :label="useString('note')"
      :state="useValidationState(v$, 'note')"
    >
      <UiInput v-model="formData.note" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'created_at')"
      :label="useString('dateTime')"
      :state="useValidationState(v$, 'created_at')"
      class="mb-0"
    >
      <UiInputDatetime v-model="formData.created_at" name="created_at" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useVuelidate } from '@vuelidate/core'
import { helpers, minValue, required } from '@vuelidate/validators'
import { useRecordsStore } from '~/store/records'

import type { RecordsItem } from '~/types'

export interface RecordsForm {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}

interface RecordFormProps {
  edit?: boolean
  record?: RecordsItem
}

const props = defineProps<RecordFormProps>()

const emit = defineEmits(['submit'])

const recordsStore = useRecordsStore()

const categories = computed(() => recordsStore.categories.map(({ id, name }) => ({ text: name, value: id })))

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

/* Initialize form values */

const formData = reactive<RecordsForm>({
  category_id: props.record?.category?.id ?? categories.value[0]?.value,
  created_at: props.record?.created_at
    ? DateTime.fromFormat(props.record.created_at, 'yyyy-LL-dd HH:mm:ss').toJSDate()
    : new Date(),
  note: props.record?.note,
  sum: props.record?.sum ?? 0,
})

/* Declare form validation rules */

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

/* Validate form and emit "submit" with formData on success */

function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    emit('submit', formData)
  }
}

function isValidDate(value: Date): boolean {
  return DateTime.fromJSDate(value).isValid
}
</script>
