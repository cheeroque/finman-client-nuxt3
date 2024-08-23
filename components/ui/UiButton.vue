<template>
  <component :is="componentName" v-bind="componentProps" :class="componentClasses">
    <UiButtonIcon v-if="icon && !iconEnd" :loading="loading" :name="icon" :size="iconSize" />

    <slot />

    <UiButtonIcon v-if="icon && iconEnd" :name="icon" :size="iconSize" />
  </component>
</template>

<script setup lang="ts">
import type { NuxtLinkProps } from '#app'
import type { ControlSize } from '~/types'

type ButtonProps = Pick<NuxtLinkProps, 'external' | 'rel' | 'target' | 'to'> & {
  block?: boolean
  disabled?: boolean
  icon?: string
  iconAriaLabel?: string
  iconEnd?: boolean
  iconSize?: number | string
  loading?: boolean
  muted?: boolean
  noText?: boolean
  outlined?: boolean
  size?: ControlSize
  type?: string
  variant?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: undefined,
  type: 'button',
})

const attrs = useAttrs()

const isNuxtLink = computed(() => Boolean(props.to))
const componentName = computed(() => (isNuxtLink.value ? resolveComponent('NuxtLink') : 'button'))

const componentClasses = computed(() => [
  {
    btn: true,
    'btn-block': props.block,
    'btn-icon': props.noText,
    disabled: props.disabled && isNuxtLink.value,
  },
  props.size && `btn-${props.size}`,
  props.variant && `btn-${props.variant}`,
])

const componentProps = computed(() => {
  const { disabled, external, rel, target, to, type } = props

  /* Props and attributes passed to NuxtLink component */
  if (isNuxtLink.value) {
    const tabindex = disabled ? '-1' : attrs.tabindex !== undefined ? String(attrs.tabindex) : undefined

    return {
      'aria-disabled': disabled,
      external,
      rel,
      tabindex,
      target,
      to,
    }
  }

  /* Attributes of button element */
  return { disabled, type }
})

/* Get button colors depending on variant/outlined/muted props */
const componentStyles = computed(() => {
  const styles = {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: 'var(--on-primary-bg)',
    focusOutlineColor: 'var(--primary-outline)',
    hoverBackgroundColor: 'var(--primary-bg)',
    hoverBorderColor: 'var(--primary-bg)',
    hoverColor: 'var(--on-primary-bg)',
  }

  if (props.variant) {
    if (props.outlined) {
      styles.borderColor = `var(--${props.variant})`
      styles.color = `var(--${props.variant})`
      styles.focusOutlineColor = `var(--${props.variant})-outline`
      styles.hoverBackgroundColor = `var(--${props.variant})`
      styles.hoverBorderColor = `var(--${props.variant})`
      styles.hoverColor = `var(--on-${props.variant})`
    } else if (props.muted) {
      styles.backgroundColor = `var(--${props.variant}-bg)`
      styles.borderColor = `var(--${props.variant}-bg)`
      styles.color = `var(--on-${props.variant}-bg)`
      styles.focusOutlineColor = `var(--${props.variant}-bg-outline)`
      styles.hoverBackgroundColor = `var(--${props.variant}-bg-active)`
      styles.hoverBorderColor = `var(--${props.variant}-bg-active)`
      styles.hoverColor = `var(--on-${props.variant}-bg)`
    } else {
      styles.backgroundColor = `var(--${props.variant})`
      styles.borderColor = `var(--${props.variant})`
      styles.color = `var(--on-${props.variant})`
      styles.focusOutlineColor = `var(--${props.variant}-outline)`
      styles.hoverBackgroundColor = `var(--${props.variant}-active)`
      styles.hoverBorderColor = `var(--${props.variant}-active)`
      styles.hoverColor = `var(--on-${props.variant})`
    }
  }

  return styles
})
</script>

<style lang="scss" scoped>
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: calc(#{$control-padding-y} + #{$border-width});
  padding: $control-padding-y $control-padding-x;
  font-family: $font-family-alternate;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-base;
  text-align: center;
  border: $border-width solid v-bind('componentStyles.borderColor');
  border-radius: $control-border-radius;
  color: v-bind('componentStyles.color');
  background-color: v-bind('componentStyles.backgroundColor');
  cursor: pointer;
  transition: $transition;
  transition-property: border-color, background-color, box-shadow, color, opacity;

  &:disabled,
  &.disabled {
    border-color: v-bind('componentStyles.borderColor');
    color: v-bind('componentStyles.color');
    background-color: v-bind('componentStyles.backgroundColor');
    opacity: 0.5;
    cursor: default;
  }

  &:not(:disabled):not(.disabled) {
    &:active,
    &:focus,
    &:hover {
      text-decoration: none;
      border-color: v-bind('componentStyles.hoverBorderColor');
      color: v-bind('componentStyles.hoverColor');
    }

    &:focus,
    &:focus-visible {
      outline: none;
      background-color: v-bind('componentStyles.backgroundColor');
    }

    &:focus-visible {
      box-shadow: 0 0 0 $control-focus-outline-width v-bind('componentStyles.focusOutlineColor');
    }

    &:active,
    &:hover {
      background-color: v-bind('componentStyles.hoverBackgroundColor');
    }
  }
}

/* Icon-only button, paddings are equal so that button is square */
.btn-icon {
  padding: $control-padding-y;
}

/* Large button */
.btn-lg {
  padding: $control-padding-y-lg $control-padding-x-lg;

  &.btn-icon {
    padding: $control-padding-y-lg;
  }
}

/* Plaintext button that looks like a link */
.btn-link {
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  text-align: inherit;
  border: none;
  color: inherit;
  background: none;
  appearance: none;
  cursor: pointer;

  &:not(:disabled):not(.disabled) {
    &:active,
    &:focus,
    &:hover {
      text-decoration: underline;
      color: $link-hover-color;
      background-color: transparent;
    }
  }
}

/* Full width block button */
.btn-block {
  display: flex;
  width: 100%;
}

/* Round close button */
.btn-close {
  padding: $control-padding-y;
  line-height: 0;
  border-radius: 99rem;
  color: inherit;

  .nuxt-icon {
    svg {
      margin-bottom: 0;
    }
  }
}
</style>
