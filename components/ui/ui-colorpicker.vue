<template>
  <UiInputGroup :size="size" :valid="valid" :validated="validated" class="colorpicker">
    <UiInput
      :id="id"
      :disabled="disabled"
      :name="name"
      :readonly="readonly"
      :required="required"
      :size="size"
      :valid="valid"
      :validated="validated"
      :value="modelValue"
      autocomplete="off"
      class="form-control"
      placeholder="#"
      @input="onInput"
    />
    <template #append>
      <label :for="colorInput?.id" :style="{ backgroundColor: bgColor, color: iconColor }" class="colorpicker-label">
        <input :value="modelValue" v-uid ref="colorInput" type="color" class="colorpicker-input" @input="onInput" />
        <UiIcon name="eyedropper-24" size="16" aria-hidden="true" />
      </label>
    </template>
  </UiInputGroup>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

interface InputInputEventTarget extends EventTarget {
  value: string
}

interface InputInputEvent extends InputEvent {
  target: InputInputEventTarget
}

const props = defineProps<{
  disabled?: boolean
  modelValue?: string
  name?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const colorInput = ref(null)

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

const bgColor = computed(() => props.modelValue || 'transparent')
const iconColor = computed(() => (props.modelValue ? getContrastColor(props.modelValue) : 'inherit'))

function getContrastColor(bgColor: string): string {
  if (!bgColor?.length) return '#000'
  const color = bgColor.substring(1)
  const rgb = []
  let lightness = 255
  for (let i = 0; i < 3; i++) {
    rgb[i] = parseInt(color.substring(i * 2, i * 2 + 2), 16)
  }
  lightness = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  return lightness >= 165 ? '#000' : '#fff'
}

function onInput(event: InputInputEvent): void {
  emit('update:modelValue', event.target.value)
}
</script>
