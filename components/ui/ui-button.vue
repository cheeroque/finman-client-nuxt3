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

<script setup>
const props = defineProps({
  block: Boolean,
  disabled: Boolean,
  href: String,
  icon: String,
  iconRight: Boolean,
  size: String,
  to: [Object, String],
  type: String,
  variant: String,
})

const emit = defineEmits(['click'])

let tagName = 'button'
const NuxtLink = resolveComponent('NuxtLink')
if (props.href) tagName = 'a'
else if (props.to) tagName = NuxtLink

let buttonClasses = ['button']
if (props.block) buttonClasses.push('button-block')
if (props.disabled) buttonClasses.push('button-disabled')
if (props.size) buttonClasses.push(`button-${props.size}`)
if (props.variant) buttonClasses.push(`button-${props.variant}`)
</script>
