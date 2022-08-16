<template>
  <component
    :is="tagName"
    :class="buttonClass"
    :disabled="disabled"
    :href="href"
    :to="to"
    :type="type"
    class="button"
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

const buttonClass = props.variant && `button-${props.variant}`

let tagName = 'button'
const NuxtLink = resolveComponent('NuxtLink')
if (props.href) tagName = 'a'
else if (props.to) tagName = NuxtLink
</script>
