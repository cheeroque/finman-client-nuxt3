<template>
  <form ref="form" class="record-form">
    <UiFormGroup :label="useString('category')">
      <UiSelect v-model="formData.category_id" :options="categoryOptions" />
    </UiFormGroup>
    <UiFormGroup :label="useString('sum')">
      <UiInputCalc v-model="formData.sum" />
    </UiFormGroup>
    <UiFormGroup :label="useString('dateTime')">
      <UiInputDatetime v-model="formData.created_at" />
    </UiFormGroup>
    <UiFormGroup :label="useString('note')" class="mb-0">
      <UiInput v-model="formData.note" :placeholder="useString('notePlaceholder')" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
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
</script>
