<template>
  <form ref="form" class="snapshot-form" @submit.prevent="submitForm">
    <UiFormGroup :label="useString('previousBalance')">
      <UiInputCalc :model-value="snapshotFragment?.balance" name="previous_balance" disabled />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(balance)"
      :label="useString('currentBalance')"
      :state="useFieldState(balance)"
    >
      <UiInputCalc v-model="balance.value.value" name="balance" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(created_at)"
      :label="useString('dateTime')"
      :state="useFieldState(created_at)"
    >
      <UiInputDatetime v-model="created_at.value.value" name="created_at" />
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
import { readFragment, SnapshotFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'

type SnapshotFormProps = {
  snapshot?: FragmentOf<typeof SnapshotFragment>
}

type SnapshotFormValues = {
  balance: number
  created_at: Date
  note?: string
}

const props = defineProps<SnapshotFormProps>()

const emit = defineEmits(['submit'])

const oldBalance = useBalance()

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const snapshotFragment = computed(() => readFragment(SnapshotFragment, props.snapshot))

const { handleSubmit, values } = useForm<SnapshotFormValues>({
  initialValues: {
    balance: oldBalance.value,
    created_at: new Date(),
    note: snapshotFragment.value?.note ?? '',
  },

  validationSchema: {
    balance: yupNumber().required(useString('fieldRequired')).min(0, useString('fieldMinimumValue', '0')),
    created_at: yupDate().required(useString('fieldRequired')).isValid(useString('invalidDate')),
    note: yupString().required(useString('fieldRequired')),
  },
})

const balance = useField<number>('balance')
const created_at = useField<Date>('created_at')
const note = useField<string>('note')

const submitForm = handleSubmit(() => {
  const { balance, note } = values
  const created_at = DateTime.fromJSDate(values.created_at).toFormat('yyyy-LL-dd HH:mm:ss')

  emit('submit', { balance, created_at, note })
})
</script>
