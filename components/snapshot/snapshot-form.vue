<template>
  <form ref="form" class="record-form" @submit.prevent="onSubmit">
    <UiFormGroup :label="useString('previousBalance')">
      <UiInputCalc :model-value="previousBalance" name="previous_balance" disabled />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('currentBalance')"
      :invalid-feedback="formatErrors(v$.balance.$errors)"
      :state="v$.balance.$error ? false : null"
    >
      <UiInputCalc v-model="formData.balance" name="balance" />
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
import { useRecordsStore } from '~/store/records'

type SnapshotForm = {
  balance: number
  created_at: Date
  note?: string
}

const emit = defineEmits(['success'])

const recordsStore = useRecordsStore()
const previousBalance = computed(() => recordsStore.snapshot?.balance)

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

/* Initialize form & watch for record changes */
const formData = reactive<SnapshotForm>({
  balance: recordsStore.balance,
  created_at: new Date(),
  note: recordsStore.snapshot?.note,
})

/* Form validation */
function isValidDate(value: Date): boolean {
  return DateTime.fromJSDate(value).isValid
}

function formatErrors(errors: ErrorObject[]): string {
  return errors.map(({ $message }) => $message).join(' ')
}

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

/* Submit form */
const pending = computed(() => recordsStore.pending)

async function onSubmit() {
  v$.value.$validate()
  if (!v$.value.$error) {
    const headers = useRequestHeaders(['cookie'])
    const cookie = headers.cookie as string
    const method = 'POST'

    recordsStore.pending = true
    const snapshot = await $fetch<RecordsSnapshot>('/api/data/revise', {
      method,
      body: formData,
      headers: { cookie },
    })

    recordsStore.snapshot = snapshot
    recordsStore.pending = false
    emit('success', snapshot)
  }
}
</script>
