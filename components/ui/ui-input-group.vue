<template>
  <div :class="componentClasses">
    <div v-if="hasPrepend" class="input-group-prepend">
      <slot name="prepend">{{ prepend }}</slot>
    </div>
    <slot></slot>
    <div v-if="hasAppend" class="input-group-append">
      <slot name="append">{{ append }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef } from 'vue'

const props = defineProps<{
  append?: number | string
  disabled?: boolean
  prepend?: number | string
  size?: ControlSize
  valid?: boolean
  validated?: boolean
}>()
const slots = useSlots()

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

const hasAppend = computed(() => Boolean(props.append || slots.append))
const hasPrepend = computed(() => Boolean(props.prepend || slots.prepend))

const validationState = computed(() => (props.validated ? props.valid : null))
const componentClasses = computed(() => {
  const classes = ['input-group']
  if (disabled.value) {
    classes.push('disabled')
  }
  if (size.value) {
    classes.push(`form-control-${size.value}`)
  }
  if (validationState.value === true) {
    classes.push('is-valid')
  }
  if (validationState.value === false) {
    classes.push('is-invalid')
  }
  return classes
})

provide('group-size', size)
</script>
