<template>
  <div class="form-check">
    <input
      :id="controlId"
      :checked="checked"
      :class="{ 'is-invalid': state === false, 'is-valid': state === true }"
      :disabled="disabled"
      :form="form"
      :name="name"
      :required="required"
      :value="modelValue"
      autocomplete="off"
      type="checkbox"
      class="form-check-input"
      @input="handleInput($event as InputEvent)"
    />

    <label v-if="hasLabel" :for="controlId" class="form-check-label">
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
import type { ControlSize } from '~/types'

type CheckboxValue = number | string | boolean | null

type UiCheckboxProps = {
  disabled?: boolean
  form?: string
  modelValue?: CheckboxValue | CheckboxValue[]
  name?: string
  required?: boolean
  size?: ControlSize
  uncheckedValue?: CheckboxValue
  valid?: boolean
  validated?: boolean
  value?: CheckboxValue
}

const props = defineProps<UiCheckboxProps>()

const emit = defineEmits(['update:modelValue'])

const baseId = useId()
const slots = useSlots()

const defaultValue = ref(props.value || true)

const controlId = computed(() => `${baseId}-control`)
const hasLabel = computed(() => useSlotHasContent(slots.default))
const state = computed(() => (props.validated ? props.valid : null))

const checked = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue.includes(defaultValue.value)
    : Boolean(defaultValue.value) === Boolean(props.modelValue)
)

function addValue(value: CheckboxValue, array: CheckboxValue[]): CheckboxValue[] {
  if (array?.indexOf(value) < 0) {
    return array.concat([value])
  } else {
    return array
  }
}

function handleInput(event: InputEvent) {
  const target = event.target
  if (!(target instanceof HTMLInputElement)) return

  const checked = target.checked

  let payload

  if (Array.isArray(props.modelValue)) {
    if (checked) {
      payload = addValue(defaultValue.value, props.modelValue)
    } else {
      payload = removeValue(defaultValue.value, props.modelValue)
    }
  } else {
    payload = checked ? defaultValue.value : props.uncheckedValue
  }

  emit('update:modelValue', payload)
}

function removeValue(value: CheckboxValue, array: CheckboxValue[]): CheckboxValue[] {
  return array?.filter((el) => el !== value)
}
</script>
