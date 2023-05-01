<template>
  <component
    :is="tagName"
    :class="buttonClasses"
    :disabled="disabled"
    :form="form"
    :href="href"
    :to="to"
    :type="type || 'button'"
    @click="handleClick"
  >
    <template v-if="icon && !iconRight">
      <UiSpinner v-if="loading" :size="iconSize" class="nuxt-icon nuxt-icon-left" />
      <UiIcon v-else :name="icon" :size="iconSize" class="nuxt-icon-left" />
    </template>
    <slot></slot>
    <template v-if="icon && iconRight">
      <UiSpinner v-if="loading" :size="iconSize" class="nuxt-icon nuxt-icon-right" />
      <UiIcon v-else :name="icon" :size="iconSize" class="nuxt-icon-right" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  block?: boolean
  disabled?: boolean
  form?: string
  href?: string
  icon?: string
  iconRight?: boolean
  iconSize?: number | string
  loading?: boolean
  rel?: string
  size?: ControlSize
  target?: string
  to?: RouteLocationRaw
  type?: string
  variant?: string
}>()
const emit = defineEmits(['click', 'click-native'])
const slots = useSlots()

const isLink = computed(() => Boolean(props.href || props.to))
const tagName = computed(() => (isLink.value ? resolveComponent('NuxtLink') : 'button'))

const buttonClasses = computed(() => {
  let classes = ['btn']

  if (props.block) classes.push('btn-block')
  if (props.disabled) classes.push('disabled')
  if (props.size) classes.push(`btn-${props.size}`)
  if (props.variant) classes.push(`btn-${props.variant}`)
  if (!slots.default) classes.push('btn-icon')

  return classes
})

function handleClick(event: Event) {
  emit('click')
  emit('click-native', event)
}
</script>
