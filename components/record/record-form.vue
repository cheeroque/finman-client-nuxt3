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
import { useMutation } from '@urql/vue'
import { useVuelidate } from '@vuelidate/core'
import { helpers, minValue, required } from '@vuelidate/validators'
import { useAuthStore } from '~/store/auth'
import { useRecordsStore } from '~/store/records'

import RECORD_CREATE_MUTATION from '~/graphql/RecordCreate.gql'
import RECORD_UPDATE_MUTATION from '~/graphql/RecordUpdate.gql'

import type { RecordsItem } from '~/types/records'

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
const refetchTrigger = useRefetchTrigger()

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

watchEffect(() => initFormData())

/* Form validation */
function isValidDate(value: Date): boolean {
  return DateTime.fromJSDate(value).isValid
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
const { executeMutation } = useMutation<RecordUpsertResponse>(
  props.edit ? RECORD_UPDATE_MUTATION : RECORD_CREATE_MUTATION
)

async function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const authStore = useAuthStore()

    const { category_id, created_at, note, sum } = formData

    const variables = {
      data: {
        category: { connect: category_id },
        created_at: DateTime.fromJSDate(created_at).toFormat('yyyy-LL-dd HH:mm:ss'),
        id: props.record?.id,
        note,
        sum,
        user: { connect: authStore.user?.id },
      },
    }

    recordsStore.pending++

    try {
      /* Upsert record */
      const { data } = await executeMutation(variables)

      if (data?.result) {
        emit('success', data.result)
      }

      /* Trigger refetch of all globally available data */
      refetchTrigger.value = true
    } catch (error: any) {}

    recordsStore.pending--
  }
}
</script>
