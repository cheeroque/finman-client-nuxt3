<template>
  <Transition
    :name="transition"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div v-if="modelValue" :class="collapseClass">
      <slot :close="close"></slot>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps<{
  collapseClass?: string
  modelValue?: boolean
  transition?: string
}>()
const emit = defineEmits(['update:modelValue', 'hidden'])

const collapseClass = props.collapseClass ?? 'collapse'
const transition = props.transition ?? 'collapse'

function close() {
  emit('update:modelValue', false)
}

function getContentHeight(el: HTMLElement): number {
  let height = 0
  for (let i = 0; i < el.children.length; i++) {
    height += (el.children[i] as HTMLElement).offsetHeight
  }
  return height
}

function onBeforeEnter(el: HTMLElement) {
  el.style.height = '0'
}

function onEnter(el: HTMLElement) {
  el.style.height = `${getContentHeight(el)}px`
}

function onAfterEnter(el: HTMLElement) {
  el.style.height = ''
}

function onBeforeLeave(el: HTMLElement) {
  el.style.height = `${getContentHeight(el)}px`
}

function onLeave(el: HTMLElement) {
  el.style.height = '0'
}

function onAfterLeave(el: HTMLElement) {
  el.style.height = ''
  emit('hidden')
}
</script>

<style lang="scss" scoped>
.collapse {
  overflow: hidden;
}
</style>
