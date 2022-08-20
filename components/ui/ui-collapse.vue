<template>
  <Transition
    name="collapse"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div v-if="modelValue" class="collapse">
      <slot :close="close"></slot>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])

function close() {
  emit('update:modelValue', false)
}

function getContentHeight(el) {
  let height = 0
  for (let i = 0; i < el?.children?.length; i++) {
    height += el?.children[i]?.offsetHeight
  }
  return height
}

function onBeforeEnter(el) {
  el.style.height = 0
}

function onEnter(el) {
  el.style.height = `${getContentHeight(el)}px`
}

function onAfterEnter(el) {
  el.style.height = null
}

function onBeforeLeave(el) {
  el.style.height = `${getContentHeight(el)}px`
}

function onLeave(el) {
  el.style.height = 0
}

function onAfterLeave(el) {
  el.style.height = null
}
</script>

<style lang="scss" scoped>
.collapse {
  transition: height 0.2s linear;
  overflow: hidden;
}
</style>
