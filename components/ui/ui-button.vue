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
    <NuxtIcon v-if="icon && !iconRight" :name="icon" />
    <slot></slot>
    <NuxtIcon v-if="icon && iconRight" :name="icon" />
  </component>
</template>

<script lang="ts" setup>
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  block?: boolean
  disabled?: boolean
  href?: string | RouteLocationRaw
  icon?: string
  iconRight?: boolean
  size?: string
  to?: string | RouteLocationRaw
  type?: String
  variant?: String
}>()
const emit = defineEmits(['click'])

const tagName = props.href ? 'a' : props.to ? resolveComponent('NuxtLink') : 'button'

let buttonClasses = ['btn']
if (props.block) buttonClasses.push('btn-block')
if (props.disabled) buttonClasses.push('btn-disabled')
if (props.size) buttonClasses.push(`btn-${props.size}`)
if (props.variant) buttonClasses.push(`btn-${props.variant}`)
</script>
