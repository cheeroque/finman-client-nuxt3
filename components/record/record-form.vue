<template>
  <form ref="form" class="record-form" @submit="onSubmit">
    <UiFormGroup
      :label="useString('category')"
      :invalid-feedback="errors.category_id"
      :state="errors.category_id ? false : null"
    >
      <UiSelect v-model="category_id" :options="categoryOptions" name="category_id" />
    </UiFormGroup>
    <UiFormGroup :label="useString('sum')" :invalid-feedback="errors.sum" :state="errors.sum ? false : null">
      <UiInputCalc v-model="sum" name="sum" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('dateTime')"
      :invalid-feedback="errors.created_at"
      :state="errors.created_at ? false : null"
    >
      <UiInputDatetime v-model="created_at" name="created_at" />
    </UiFormGroup>
    <UiFormGroup
      :label="useString('note')"
      :invalid-feedback="errors.note"
      :state="errors.note ? false : null"
      class="mb-0"
    >
      <UiInput v-model="note" :placeholder="useString('notePlaceholder')" name="note" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useForm } from 'vee-validate'
import { Ref } from 'vue'
import { date, number, object, string } from 'yup'
import { useRecordsStore } from '@/store/records'

type RecordsForm = {
  category_id: number
  created_at: Date
  note?: string
  sum: number
}

const props = defineProps<{
  record?: RecordsItem
}>()

const emit = defineEmits(['success'])

/* Expose form element as ref for parent */
const form = ref()
defineExpose({ form })

const recordsStore = useRecordsStore()
const categories = recordsStore.categories
const categoryOptions = computed(() => categories.map(({ id, name }) => ({ text: name, value: id })))

const formData = ref<RecordsForm>({
  category_id: categoryOptions.value[0]?.value,
  created_at: new Date(),
  note: undefined,
  sum: 0,
})

function initFormData(): void {
  if (props.record?.id) {
    const { category_id, created_at, note, sum } = props.record
    formData.value = {
      category_id,
      created_at: DateTime.fromISO(created_at).toJSDate(),
      note,
      sum,
    }
  }
}

initFormData()
watch(
  () => props.record?.id,
  () => {
    initFormData()
  }
)

/* Form validation */
const schema = object().shape({
  category_id: number().integer().min(1, useString('fieldRequired')),
  created_at: date(),
  note: string().required(useString('fieldRequired')),
  sum: number()
    .integer()
    .required(useString('fieldRequired'))
    .min(0, ({ min }) => `${useString('fieldMinimumValue')} ${min}`),
})

const { errors, handleSubmit, useFieldModel } = useForm({
  initialValues: formData.value,
  validationSchema: schema,
})

const category_id: Ref<number> = useFieldModel('category_id')
const created_at: Ref<Date> = useFieldModel('created_at')
const note: Ref<string | undefined> = useFieldModel('note')
const sum: Ref<number> = useFieldModel('sum')

const onSubmit = handleSubmit(() => {
  console.log('submit!')
  emit('success')
})
</script>
