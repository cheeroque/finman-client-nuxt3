<template>
  <UiInputGroup :size="size" :valid="valid" :validated="validated">
    <UiInput
      ref="input"
      :id="id"
      :disabled="disabled"
      :model-value="modelValue"
      :name="name"
      :required="required"
      :size="size"
      :valid="valid"
      :validated="validated"
      autocomplete="off"
      placeholder="0"
      @blur.native="calculate"
      @focus.native="onFocus"
      @input.native.prevent="onInput"
      @keydown.native.enter="onEnter"
    />
    <template #append>
      <slot name="append">
        <div class="input-group-text">
          {{ append || '₽' }}
        </div>
      </slot>
    </template>
  </UiInputGroup>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

type FakeFocusEvent = {
  target: HTMLInputElement
}

const props = defineProps<{
  append?: string
  disabled?: boolean
  modelValue?: number | string
  name?: string
  required?: boolean
  size?: ControlSize
  valid?: boolean
  validated?: boolean
}>()
const emit = defineEmits(['update:modelValue'])

const input = ref(null)

const id: ComputedRef<string> | null = inject('control-id', null)

const groupSize: ComputedRef<string> = inject(
  'group-size',
  computed(() => '')
)
const size = computed(() => props.size || groupSize?.value)

const groupDisabled: ComputedRef<boolean> = inject(
  'group-disabled',
  computed(() => false)
)
const disabled = computed(() => props.disabled || groupDisabled?.value)

const hasTotal = ref(false)

function calculate(event: FocusEvent | FakeFocusEvent): void {
  const target = event.target as HTMLInputElement
  const matches = target.value.match(/([+-]{0,}\d{1,})/gi) || []
  const total = matches.reduce((total, match) => {
    total += Number(match)
    return total
  }, 0)
  emit('update:modelValue', total)
  hasTotal.value = true
}

function onEnter(event: KeyboardEvent): void {
  const target = event.target as HTMLInputElement
  if (!hasTotal.value) {
    event.preventDefault()
    calculate({ target })
    // /* force input value update (for +0 situations) */
    target.value = props.modelValue.toString()
  }
}

function onFocus(event: FocusEvent): void {
  /* move caret to the end on input focus */
  const target = event.target as HTMLInputElement
  if (target.selectionEnd) {
    target.setSelectionRange(target.selectionEnd, target.selectionEnd)
  }
}

function onInput(event: InputEvent): void {
  hasTotal.value = false
  const target = event.target as HTMLInputElement
  const pattern = /[^\d+-]/
  const filteredValue = `${target.value}`.replace(pattern, '')
  target.value = filteredValue || '0'
}
</script>
