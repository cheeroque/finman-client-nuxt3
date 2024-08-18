<template>
  <form ref="form" class="snapshot-form" @submit.prevent="submitForm">
    <UiFormGroup :label="useString('previousBalance')">
      <UiInputCalc :model-value="snapshot?.sum" name="previous_balance" disabled />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(sum)"
      :label="useString('currentBalance')"
      :state="useFieldState(sum)"
    >
      <UiInputCalc v-model="sum.value.value" name="sum" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(createdAt)"
      :label="useString('dateTime')"
      :state="useFieldState(createdAt)"
    >
      <UiInputDatetime v-model="createdAt.value.value" name="createdAt" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(note)"
      :label="useString('note')"
      :state="useFieldState(note)"
      class="mb-0"
    >
      <UiInput v-model="note.value.value" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { date as yupDate, number as yupNumber, string as yupString } from 'yup'
import type { Snapshot } from '~/types'

type SnapshotFormProps = {
  snapshot?: Snapshot
}

const props = defineProps<SnapshotFormProps>()

const emit = defineEmits(['submit'])

const globalStore = useGlobalStore()
const { balance } = storeToRefs(globalStore)

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const { handleSubmit, values } = useForm({
  initialValues: {
    createdAt: new Date(),
    note: props.snapshot?.note ?? '',
    sum: balance.value,
  },

  validationSchema: {
    createdAt: yupDate().required(useString('fieldRequired')).isValid(useString('invalidDate')),
    note: yupString().required(useString('fieldRequired')),
    sum: yupNumber().required(useString('fieldRequired')).min(0, useString('fieldMinimumValue', '0')),
  },
})

const createdAt = useField<Date>('createdAt')
const note = useField<string>('note')
const sum = useField<number>('sum')

const submitForm = handleSubmit(() => {
  const { note, sum } = values
  const createdAt = DateTime.fromJSDate(values.createdAt).toSQL()

  emit('submit', { createdAt, note, sum })
})
</script>
