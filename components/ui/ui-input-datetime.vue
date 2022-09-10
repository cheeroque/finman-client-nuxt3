<template>
  <UiDropdown v-model="dropdownVisible" class="datetimepicker">
    <template #toggle="{ show }">
      <UiInputGroup :size="size" :valid="valid" :validated="validated">
        <UiInput
          :id="id"
          :disabled="disabled"
          :name="name"
          :placeholder="placeholder"
          :readonly="readonly"
          :required="required"
          :size="size"
          :valid="valid"
          :validated="validated"
          :value="formattedValue"
          autocomplete="off"
          class="form-control"
          @click="show"
          @input="onInput"
        />
        <template #append>
          <UiButton icon="stopwatch-24" icon-size="16" variant="link" @click="setNow" />
        </template>
      </UiInputGroup>
    </template>
    <template #default="{ close }">
      <UiInputDatetimeDropdown v-model="modelValue" @close="close" />
    </template>
  </UiDropdown>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'
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
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const id: ComputedRef<string> | null = inject('control-id', null)
const groupDisabled: ComputedRef<boolean> = inject(
  'group-disabled',
  computed(() => false)
)
const groupSize: ComputedRef<string> = inject(
  'group-size',
  computed(() => '')
)

const disabled = computed(() => props.disabled || groupDisabled?.value)
const size = computed(() => props.size || groupSize?.value)

const format = computed(() => props.format || 'dd.LL.yyyy HH:mm')
const formattedValue = computed(() =>
  props.modelValue ? DateTime.fromJSDate(props.modelValue).toFormat(format.value) : null
)

const placeholder = computed(() => props.placeholder || DateTime.now().toFormat(format.value))

const dropdownVisible = ref(false)

function onInput(event: TextInputEvent): void {
  const value = event.target.value
  if (!value) {
    emit('update:modelValue', null)
    return
  }

  const datetime = DateTime.fromFormat(value, format.value)
  if (!datetime.isValid) return
  emit('update:modelValue', datetime.toJSDate())
}

function setNow(): void {
  emit('update:modelValue', new Date())
}
</script>
