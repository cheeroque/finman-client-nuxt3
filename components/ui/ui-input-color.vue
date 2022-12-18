<template>
  <UiInput
    :disabled="disabled"
    :model-value="modelValue"
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
      <label
        :for="colorInput?.id"
        :style="{ backgroundColor: bgColor, color: iconColor }"
        class="form-control-icon colorpicker-label"
      >
        <input v-uid ref="colorInput" :value="modelValue" type="color" class="colorpicker-input" @input="handleInput" />
        <UiIcon name="eyedropper-24" size="16" aria-hidden="true" />
      </label>
    </template>
  </UiInput>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  modelValue?: string
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: boolean
  size?: ControlSize
  state?: ControlState
}>()
const emit = defineEmits(['update:modelValue'])

const colorInput = ref()

const bgColor = computed(() => props.modelValue || 'transparent')
const iconColor = computed(() => (props.modelValue ? getContrastColor(props.modelValue) : 'inherit'))
const placeholder = computed(() => props.placeholder || '#')

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

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
