<template>
  <div class="datetimepicker-menu">
    <UiDatepicker v-show="!savedDate" v-model="localDate" />
    <UiTimepicker v-show="savedDate" v-model="localTime" />
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'

const props = defineProps<{
  hideTime?: boolean
  modelValue?: Date
}>()
const emit = defineEmits(['update:modelValue', 'close'])

const savedDate = ref(null)

const localDate = computed({
  get: () => props.modelValue,
  set: (event) => {
    savedDate.value = event
    if (props.hideTime) {
      emit('update:modelValue', event)
      emit('close')
    }
  },
})

const localTime = computed({
  get: () => savedDate.value,
  set: (event) => {
    const newDate = DateTime.fromJSDate(event)
    const { hour, minute, second } = newDate
    savedDate.value = DateTime.fromJSDate(savedDate.value).set({ hour, minute, second }).toJSDate()
    emit('update:modelValue', savedDate.value)
    emit('close')
  },
})
</script>
