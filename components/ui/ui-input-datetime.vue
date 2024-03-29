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
          <UiButton class="form-control-icon" icon="stopwatch-24" variant="link" @click="show" />
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

interface UiInputDatetimeProps {
  disabled?: boolean
  format?: string
  modelValue?: Date
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: ControlState
}

const props = defineProps<UiInputDatetimeProps>()

const emit = defineEmits(['update:modelValue'])

const dropdownVisible = ref(false)

const format = computed(() => props.format ?? 'dd.LL.yyyy HH:mm')
const placeholder = computed(() => props.placeholder ?? DateTime.now().toFormat(format.value))

const formattedValue = computed(() =>
  props.modelValue ? DateTime.fromJSDate(props.modelValue).toFormat(format.value) : undefined
)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement

  if (!target.value) {
    emit('update:modelValue', null)
    return
  }

  const datetime = DateTime.fromFormat(target.value, format.value)

  if (!datetime.isValid) return

  emit('update:modelValue', datetime.toJSDate())
}

function setNow() {
  dropdownVisible.value = false

  emit('update:modelValue', new Date())
}
</script>
