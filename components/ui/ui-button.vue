<template>
  <component
    :is="tagName"
    :class="buttonClasses"
    :disabled="disabled"
    :href="href"
    :to="to"
    :type="type"
    @click="emit('click')"
  >
    <UiIcon v-if="icon && !iconRight" :name="icon" :size="iconSize" />
    <slot></slot>
    <UiIcon v-if="icon && iconRight" :name="icon" :size="iconSize" />
  </component>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  block?: boolean
  disabled?: boolean
  href?: string
  icon?: string
  iconRight?: boolean
  iconSize?: number | string
  rel?: string
  size?: ControlSize
  target?: string
  to?: string | RouteLocationRaw
  type?: string
  variant?: string
}>()
const emit = defineEmits(['click'])
const slots = useSlots()

const tagName = props.href ? 'a' : props.to ? resolveComponent('NuxtLink') : 'button'

let buttonClasses = ['btn']
if (props.block) buttonClasses.push('btn-block')
if (props.disabled) buttonClasses.push('disabled')
if (props.size) buttonClasses.push(`btn-${props.size}`)
if (props.variant) buttonClasses.push(`btn-${props.variant}`)
if (!slots.default) buttonClasses.push('btn-icon')
</script>
