<template>
  <component
    :is="tagName"
    :class="componentClasses"
    :disabled="disabled"
    :form="form"
    :rel="rel"
    :target="target"
    :to="to"
    :type="type"
    @click="handleClick"
  >
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

type UiButtonProps = {
  block?: boolean
  disabled?: boolean
  form?: string
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
}

const props = defineProps<UiButtonProps>()

const emit = defineEmits(['click', 'click-native'])

const slots = useSlots()

const isLink = computed(() => Boolean(props.to))
const tagName = computed(() => (isLink.value ? resolveComponent('NuxtLink') : 'button'))
const type = computed(() => props.type ?? 'button')

const componentClasses = computed(() => {
  let classes = ['btn']

  if (props.block) classes.push('btn-block')
  if (props.disabled) classes.push('disabled')
  if (props.size) classes.push(`btn-${props.size}`)
  if (props.variant) classes.push(`btn-${props.variant}`)

  if (!useSlotHasContent(slots.default)) classes.push('btn-icon')

  return classes
})

function handleClick(event: Event) {
  emit('click')
  emit('click-native', event)
}
</script>
