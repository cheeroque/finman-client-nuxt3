<template>
  <form ref="form" class="record-form" @submit.prevent="handleSubmit">
    <UiFormGroup :label="useString('previousBalance')">
      <UiInputCalc :model-value="previousBalance" name="previous_balance" disabled />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="formatErrors(v$.balance.$errors)"
      :label="useString('currentBalance')"
      :state="v$.balance.$error ? false : null"
    >
      <UiInputCalc v-model="formData.balance" name="balance" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="formatErrors(v$.created_at.$errors)"
      :label="useString('dateTime')"
      :state="v$.created_at.$error ? false : null"
    >
      <UiInputDatetime v-model="formData.created_at" name="created_at" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="formatErrors(v$.note.$errors)"
      :label="useString('note')"
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
import { RecordsSnapshot } from '~~/types/records'
import { useRecordsStore } from '~/store/records'

import SNAPSHOT_CREATE_MUTATION from '@/graphql/SnapshotCreate.gql'

interface SnapshotForm {
  balance: number
  created_at: Date
  note?: string
}

interface SnapshotCreateResponse {
  result: RecordsSnapshot
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
async function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const { balance, created_at, note } = formData

    const data = {
      balance,
      created_at: DateTime.fromJSDate(created_at).toFormat('yyyy-LL-dd HH:mm:ss'),
      note,
    }

    recordsStore.pending++

    const { mutate } = useMutation<SnapshotCreateResponse>(SNAPSHOT_CREATE_MUTATION)

    try {
      const response = await mutate({ data })

      if (response?.data?.result) {
        recordsStore.snapshot = response.data.result
        emit('success', response.data.result)
      }
    } catch (error: any) {}

    recordsStore.pending--
  }
}
</script>
