<template>
  <form ref="form" class="transaction-form" @submit.prevent="submitForm">
    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(categoryId)"
      :label="useString('category')"
      :state="useFieldState(categoryId)"
    >
      <UiSelect v-model="categoryId.value.value" :options="categoryOptions" name="category_id" />
    </UiFormGroup>

    <UiFormGroup :invalid-feedback="useFieldErrorMessage(sum)" :label="useString('sum')" :state="useFieldState(sum)">
      <UiInputCalc v-model="sum.value.value" name="sum" autofocus />
    </UiFormGroup>

    <UiFormGroup :invalid-feedback="useFieldErrorMessage(note)" :label="useString('note')" :state="useFieldState(note)">
      <UiInput v-model="note.value.value" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(createdAt)"
      :label="useString('dateTime')"
      :state="useFieldState(createdAt)"
      class="mb-0"
    >
      <UiInputDatetime v-model="createdAt.value.value" name="created_at" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { date as yupDate, number as yupNumber, string as yupString } from 'yup'
import type { Transaction } from '~/types'

type TransactionFormProps = {
  edit?: boolean
  transaction?: Transaction
}

const props = defineProps<TransactionFormProps>()

const emit = defineEmits(['submit'])

const globalStore = useGlobalStore()
const { categories } = storeToRefs(globalStore)

const categoryOptions = computed(() => categories.value.map(({ id, name }) => ({ text: name, value: id })))

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const { handleSubmit, values } = useForm({
  initialValues: {
    categoryId: Number(props.transaction?.categoryId ?? categoryOptions.value[0]?.value),
    createdAt: initCreatedAt(),
    note: props.transaction?.note ?? '',
    sum: props.transaction?.sum ?? 0,
  },

  validationSchema: {
    categoryId: yupNumber().required(useString('fieldRequired')),
    createdAt: yupDate().required(useString('fieldRequired')).isValid(useString('invalidDate')),
    note: yupString().required(useString('fieldRequired')),
    sum: yupNumber().required(useString('fieldRequired')).min(0, useString('fieldMinimumValue', '0')),
  },
})

const categoryId = useField<number>('categoryId')
const createdAt = useField<Date>('createdAt')
const note = useField<string>('note')
const sum = useField<number>('sum')

const submitForm = handleSubmit(() => {
  const { categoryId, note, sum } = values
  const createdAt = DateTime.fromJSDate(values.createdAt).toSQL()
  emit('submit', { categoryId, createdAt, note, sum })
})

function initCreatedAt() {
  let dateTime = DateTime.fromSQL(props.transaction?.createdAt ?? '')

  if (!dateTime.isValid) {
    dateTime = DateTime.now()
  }

  return dateTime.toJSDate()
}
</script>
