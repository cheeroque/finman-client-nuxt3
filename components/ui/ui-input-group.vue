<template>
  <div class="input-group">
    <div v-if="hasPrepend">
      <slot name="prepend">{{ prepend }}</slot>
    </div>
    <slot></slot>
    <div v-if="hasAppend">
      <slot name="append">{{ append }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  append?: number | string
  prepend?: number | string
}>()
const slots = useSlots()

const hasAppend = computed(() => Boolean(props.append || slots.append))
const hasPrepend = computed(() => Boolean(props.prepend || slots.prepend))
</script>
