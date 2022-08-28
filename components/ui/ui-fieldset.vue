<template>
  <fieldset ref="fieldset" :class="{ disabled: disabled }" :disabled="disabled" class="form-fieldset">
    <legend v-if="hasLegend" class="form-legend">
      <slot name="legend">
        {{ legend }}
      </slot>
    </legend>
    <slot></slot>
  </fieldset>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean
  legend?: string
}>()
const slots = useSlots()

const hasLegend = computed(() => Boolean(props.legend || slots.legend))
const disabled = computed(() => props.disabled)

provide('fieldset-disabled', disabled)
</script>
