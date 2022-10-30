<template>
  <form ref="form" class="record-form">
    <UiFormGroup :label="useString('category')">
      <UiSelect v-model="categoryId" :options="categoryOptions" />
    </UiFormGroup>
    <UiFormGroup :label="useString('sum')">
      <UiInputCalc v-model="sum" />
    </UiFormGroup>
    <UiFormGroup :label="useString('dateTime')">
      <UiInputDatetime v-model="createdAt" />
    </UiFormGroup>
    <UiFormGroup :label="useString('note')" class="mb-0">
      <UiInput v-model="note" />
    </UiFormGroup>
  </form>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { useRecordsStore } from '@/store/records'

const props = defineProps<{
  edit?: boolean
  record?: RecordsItem
}>()

const recordsStore = useRecordsStore()
const categories = recordsStore.categories
const categoryOptions = computed(() => categories.map(({ id, name }) => ({ text: name, value: id })))

const categoryId = ref(props.record.category_id)
const sum = ref(props.record.sum)
const createdAt = ref(DateTime.fromISO(props.record.created_at).toJSDate())
const note = ref(props.record.note)

const form = ref(null)
defineExpose({ form })
</script>
