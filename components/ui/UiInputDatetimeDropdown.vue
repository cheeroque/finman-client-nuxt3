<template>
  <div class="datetimepicker-menu">
    <div :class="{ 'panel-time': savedDate && !hideTime }" class="datetimepicker-panels">
      <UiDatepicker v-model="localDate" class="datetimepicker-panel" />

      <div v-if="!hideTime" class="datetimepicker-panel datetimepicker-panel-time">
        <UiTimepicker v-model="localTime" />
      </div>
    </div>
  </div>

  <div class="datetimepicker-footer">
    <UiButton variant="neutral-muted" @click="emit('close')"> {{ useString('cancel') }} </UiButton>

    <UiButton variant="secondary" @click="emit('set-now')"> {{ useString('now') }} </UiButton>
  </div>

  <div class="datetimepicker-backdrop" @click="emit('close')" />
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

type InputDatetimeDropdownProps = {
  hideTime?: boolean
  modelValue?: Date
}

const props = defineProps<InputDatetimeDropdownProps>()

const emit = defineEmits(['update:modelValue', 'close', 'set-now'])

const savedDate = ref()

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
