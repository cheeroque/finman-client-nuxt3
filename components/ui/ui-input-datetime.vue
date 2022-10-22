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
        @click="show"
        @input="onInput"
      >
        <template #append>
          <UiButton icon="stopwatch-24" variant="link" class="form-control-icon" @click="setNow" />
        </template>
      </UiInput>
    </template>
    <template #default="{ close }">
      <UiInputDatetimeDropdown v-model="modelValue" @close="close" />
    </template>
  </UiDropdown>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'

const props = defineProps<{
  disabled?: boolean
  format?: string
  modelValue?: Date
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: ControlState
}>()
const emit = defineEmits(['update:modelValue'])

const dropdownVisible = ref(false)

const format = computed(() => props.format || 'dd.LL.yyyy HH:mm')
const formattedValue = computed(() =>
  props.modelValue ? DateTime.fromJSDate(props.modelValue).toFormat(format.value) : null
)
const placeholder = computed(() => props.placeholder || DateTime.now().toFormat(format.value))

function onInput(event: InputEvent): void {
  const target = event.target as HTMLInputElement
  if (!target.value) {
    emit('update:modelValue', null)
    return
  }

  const datetime = DateTime.fromFormat(target.value, format.value)
  if (!datetime.isValid) return
  emit('update:modelValue', datetime.toJSDate())
}

function setNow(): void {
  emit('update:modelValue', new Date())
}
</script>
