<template>
  <form ref="form" class="transaction-form" @submit.prevent="submitForm">
    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(category_id)"
      :label="useString('category')"
      :state="useFieldState(category_id)"
    >
      <UiSelect v-model="category_id.value.value" :options="categoryOptions" name="category_id" />
    </UiFormGroup>

    <UiFormGroup :invalid-feedback="useFieldErrorMessage(sum)" :label="useString('sum')" :state="useFieldState(sum)">
      <UiInputCalc v-model="sum.value.value" name="sum" autofocus />
    </UiFormGroup>

    <UiFormGroup :invalid-feedback="useFieldErrorMessage(note)" :label="useString('note')" :state="useFieldState(note)">
      <UiInput v-model="note.value.value" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>

    <UiFormGroup
      :invalid-feedback="useFieldErrorMessage(created_at)"
      :label="useString('dateTime')"
      :state="useFieldState(created_at)"
      class="mb-0"
    >
      <UiInputDatetime v-model="created_at.value.value" name="created_at" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { date as yupDate, number as yupNumber, string as yupString } from 'yup'
import { readFragment, CategoryFragment, TransactionFragment } from '~/graphql'
import type { FragmentOf } from '~/graphql'
import type { TransactionFormValues } from '~/types'

type TransactionFormProps = {
  edit?: boolean
  transaction?: FragmentOf<typeof TransactionFragment> & {
    category?: FragmentOf<typeof CategoryFragment>
  }
}

const props = defineProps<TransactionFormProps>()

const emit = defineEmits(['submit'])

const categories = useCategories()

const categoryOptions = computed(() =>
  categories.value.map((category) => {
    const { id, name } = readFragment(CategoryFragment, category)
    return { text: name, value: id }
  })
)

/* Expose form element as ref for parent */

const form = ref()
defineExpose({ form })

const transactionFragment = computed(() => readFragment(TransactionFragment, props.transaction))
const categoryFragment = computed(() => readFragment(CategoryFragment, props.transaction?.category))

const { handleSubmit, values } = useForm<TransactionFormValues>({
  initialValues: {
    category_id: Number(categoryFragment.value?.id ?? categoryOptions.value[0]?.value),
    created_at: transactionFragment.value?.created_at
      ? DateTime.fromFormat(transactionFragment.value.created_at, 'yyyy-LL-dd HH:mm:ss').toJSDate()
      : new Date(),
    note: transactionFragment.value?.note ?? '',
    sum: transactionFragment.value?.sum ?? 0,
  },

  validationSchema: {
    category_id: yupNumber().required(useString('fieldRequired')),
    created_at: yupDate().required(useString('fieldRequired')).isValid(useString('invalidDate')),
    note: yupString().required(useString('fieldRequired')),
    sum: yupNumber().required(useString('fieldRequired')).min(0, useString('fieldMinimumValue', '0')),
  },
})

const category_id = useField<number>('category_id')
const created_at = useField<Date>('created_at')
const note = useField<string>('note')
const sum = useField<number>('sum')

const submitForm = handleSubmit(() => {
  emit('submit', values)
})
</script>
