<template>
  <UiDropdown v-model="dropdownVisible" class="datetimepicker">
    <template #toggle="{ show }">
      <UiInput
        :disabled="disabled"
        :model-value="formattedValue"
        :name="name"
        :placeholder="placeholder"
        :readonly="readonly"
        :required="required"
        :size="size"
        :state="state"
        autocomplete="off"
        @input="handleInput"
      >
        <template #append>
          <UiButton class="form-control-icon" icon="stopwatch-24" variant="link" no-text @click="show" />
        </template>
      </UiInput>
    </template>

    <template #default="{ close }">
      <UiInputDatetimeDropdown
        :model-value="modelValue"
        @close="close"
        @set-now="setNow"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </template>
  </UiDropdown>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'

import type { ControlSize } from '~/types'

type InputDatetimeProps = {
  disabled?: boolean
  format?: string
  modelValue?: Date
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: boolean | null
}

const props = withDefaults(defineProps<InputDatetimeProps>(), {
  format: 'dd.LL.yyyy HH:mm',
  state: null,
})

const emit = defineEmits(['update:modelValue'])

const dropdownVisible = ref(false)

const placeholder = computed(() => props.placeholder ?? DateTime.now().toFormat(props.format))

const formattedValue = computed(() =>
  props.modelValue ? DateTime.fromJSDate(props.modelValue).toFormat(props.format) : undefined
)

function handleInput(event: InputEvent) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  let emitValue: Date | null = null

  const datetime = DateTime.fromFormat(target.value, props.format)
  if (datetime.isValid) {
    emitValue = datetime.toJSDate()
  }

  emit('update:modelValue', emitValue)
}

function setNow() {
  dropdownVisible.value = false

  emit('update:modelValue', new Date())
}
</script>
