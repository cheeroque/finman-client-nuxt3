<template>
  <form ref="form" class="record-form" @submit.prevent="handleSubmit">
    <UiFormGroup
      :invalid-feedback="formatErrors(v$.category_id.$errors)"
      :label="useString('category')"
      :state="v$.category_id.$error ? false : null"
    >
      <UiSelect v-model="formData.category_id" :options="categories" name="category_id" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="formatErrors(v$.sum.$errors)"
      :label="useString('sum')"
      :state="v$.sum.$error ? false : null"
    >
      <UiInputCalc v-model="formData.sum" name="sum" />
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
import { RecordsItem } from '~~/types/records'
import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

import RECORD_CREATE_MUTATION from '@/graphql/RecordCreate.gql'
import RECORD_UPDATE_MUTATION from '@/graphql/RecordUpdate.gql'

interface RecordsForm {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}

interface RecordUpsertResponse {
  result: RecordsItem
}

const props = defineProps<{
  edit?: boolean
  record?: RecordsItem
}>()

const emit = defineEmits(['success'])

const recordsStore = useRecordsStore()
const categories = computed(() => recordsStore.categories.map(({ id, name }) => ({ text: name, value: id })))

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

/* Initialize form & watch for record changes */
const formData = reactive<RecordsForm>({
  category_id: categories.value[0]?.value,
  created_at: new Date(),
  note: undefined,
  sum: 0,
})

function initFormData() {
  if (props.edit && props.record) {
    const { category, created_at, note, sum } = props.record

    formData.category_id = category.id
    formData.created_at = DateTime.fromFormat(created_at, 'yyyy-LL-dd HH:mm:ss').toJSDate()
    formData.note = note
    formData.sum = sum
  }
}

watchEffect(() => {
  initFormData()
})

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
async function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const authStore = useAuthStore()

    const { category_id, created_at, note, sum } = formData

    const data = {
      category: { connect: category_id },
      created_at: DateTime.fromJSDate(created_at).toFormat('yyyy-LL-dd HH:mm:ss'),
      id: props.record?.id,
      note,
      sum,
      user: { connect: authStore.user?.id },
    }

    const mutation = props.edit ? RECORD_UPDATE_MUTATION : RECORD_CREATE_MUTATION

    recordsStore.pending++

    const { mutate } = useMutation<RecordUpsertResponse>(mutation)

    try {
      const response = await mutate({ data })

      if (response?.data?.result) {
        emit('success', response.data.result)
      }
    } catch (error: any) {}

    recordsStore.pending--
  }
}
</script>
