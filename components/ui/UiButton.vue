<template>
  <component :is="componentName" :class="componentClasses" v-bind="componentProps" @click="handleClick">
    <template v-if="icon && !iconRight">
      <UiSpinner v-if="loading" :size="iconSize" class="nuxt-icon nuxt-icon-left" />

      <UiIcon v-else :name="icon" :size="iconSize" class="nuxt-icon-left" />
    </template>

    <slot />

    <template v-if="icon && iconRight">
      <UiSpinner v-if="loading" :size="iconSize" class="nuxt-icon nuxt-icon-right" />

      <UiIcon v-else :name="icon" :size="iconSize" class="nuxt-icon-right" />
    </template>
  </component>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import type { ControlSize } from '~/types'

type ButtonAttrs = {
  'aria-disabled'?: boolean
  tabindex?: string
}

type ButtonProps = {
  block?: boolean
  disabled?: boolean
  form?: string
  icon?: string
  iconRight?: boolean
  iconSize?: number | string
  loading?: boolean
  rel?: string
  noText?: boolean
  size?: ControlSize
  target?: string
  to?: RouteLocationRaw
  type?: string
  variant?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: undefined,
  type: 'button',
})

const emit = defineEmits(['click', 'click-native'])

const attrs = useAttrs()

const isNuxtLink = computed(() => Boolean(props.to))
const componentName = computed(() => (isNuxtLink.value ? resolveComponent('NuxtLink') : 'button'))

const componentClasses = computed(() => {
  let classes = ['btn']

  if (props.block) classes.push('btn-block')
  if (props.size) classes.push(`btn-${props.size}`)
  if (props.variant) classes.push(`btn-${props.variant}`)
  if (props.noText) classes.push('btn-icon')

  /* Disabled class should only be applied to <NuxtLink> */
  if (props.disabled && isNuxtLink.value) classes.push('disabled')

  return classes
})

const componentProps = computed(() => {
  const { disabled, form, rel, target, to, type } = props
  const propsObject: ButtonProps & ButtonAttrs = {}
  let tabindex

  if (isNuxtLink.value) {
    /* Props & attrs that should be bound to <NuxtLink> */
    if (props.disabled) {
      tabindex = '-1'
    } else if (attrs.tabindex !== undefined) {
      tabindex = String(attrs.tabindex)
    }

    propsObject['aria-disabled'] = props.disabled
    propsObject.rel = rel
    propsObject.tabindex = tabindex
    propsObject.target = target
    propsObject.to = to
  } else {
    /* Props & attrs that should be bound to <button> */
    propsObject.disabled = disabled
    propsObject.form = form
    propsObject.type = type
  }

  return propsObject
})

function handleClick(event: Event) {
  emit('click')
  emit('click-native', event)
}
</script>
