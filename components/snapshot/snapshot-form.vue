<template>
  <form ref="form" class="record-form" @submit.prevent="handleSubmit">
    <UiFormGroup :label="useString('previousBalance')">
      <UiInputCalc :model-value="previousBalance" name="previous_balance" disabled />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'balance')"
      :label="useString('currentBalance')"
      :state="useValidationState(v$, 'balance')"
    >
      <UiInputCalc v-model="formData.balance" name="balance" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'created_at')"
      :label="useString('dateTime')"
      :state="useValidationState(v$, 'created_at')"
    >
      <UiInputDatetime v-model="formData.created_at" name="created_at" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useValidationErrors(v$, 'note')"
      :label="useString('note')"
      :state="useValidationState(v$, 'note')"
      class="mb-0"
    >
      <UiInput v-model="formData.note" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, minValue, required } from '@vuelidate/validators'
import { DateTime } from 'luxon'
import { useRecordsStore } from '~/store/records'

interface SnapshotForm {
  balance: number
  created_at: Date
  note?: string
}

const emit = defineEmits(['submit'])

const recordsStore = useRecordsStore()

const previousBalance = computed(() => recordsStore.snapshot?.balance)

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

/* Initialize form with stored snapshot values */

const formData = reactive<SnapshotForm>({
  balance: recordsStore.balance,
  created_at: new Date(),
  note: recordsStore.snapshot?.note,
})

/* Declare form validation rules */

const rules = computed(() => ({
  balance: {
    minValue: helpers.withMessage(({ $params }) => `${useString('fieldMinimumValue')} ${$params.min}`, minValue(0)),
    required: helpers.withMessage(useString('fieldRequired'), required),
  },
  created_at: {
    required: helpers.withMessage(useString('fieldRequired'), required),
    isValidDate: helpers.withMessage(useString('invalidDate'), isValidDate),
  },
  note: { required: helpers.withMessage(useString('fieldRequired'), required) },
}))

const v$ = useVuelidate<SnapshotForm>(rules, formData, { $lazy: true })

/* Validate form & emit "submit" with form values on success */

async function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const { balance, note } = formData
    const created_at = DateTime.fromJSDate(formData.created_at).toFormat('yyyy-LL-dd HH:mm:ss')

    emit('submit', { balance, created_at, note })
  }
}

function isValidDate(value: Date): boolean {
  return DateTime.fromJSDate(value).isValid
}
</script>
