<template>
  <NuxtLink
    :to="`/categories/${category.slug}`"
    :class="{ 'caption-outside': captionOutside, 'caption-visible': visible }"
    :style="{
      '--category-bar-color': category.color,
      '--category-text-color': textColor,
      '--category-bar-width': barWidth,
    }"
    class="category-link"
  >
    <div ref="caption" class="category-link-caption">
      <span class="category-total"> {{ useNumberFormat(total) }}&nbsp;₽ </span>
      <span class="category-name">
        {{ category.name }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RecordsCategory } from '~/types/records'

const props = defineProps<{
  category: RecordsCategory
  maxTotal: number
  total: number
}>()

const textColor = computed(() => useContrastColor(props.category.color))

const barWidth = ref('100%')

const caption = ref()
const captionOutside = ref(false)
const visible = ref(false)

function initCaption() {
  /* Determine whether category caption should be inside or outside the bar */
  if (!caption.value) return

  visible.value = false

  const captionEl = caption.value
  const parent = captionEl.closest('.category-link')
  const root = parent.parentElement

  const captionWidth = captionEl.offsetWidth
  const rootWidth = root?.offsetWidth ?? 0

  const parentWidth = Math.round((rootWidth * props.total) / props.maxTotal)

  captionOutside.value = captionWidth > parentWidth
  barWidth.value = `${parentWidth}px`

  visible.value = true
}

watch(
  () => [props.maxTotal, props.total],
  () => {
    initCaption()
  }
)

onMounted(() => {
  initCaption()
})
</script>

<style lang="scss" scoped>
.category-link {
  position: relative;
  display: flex;
  align-items: center;
  height: 3rem;
  width: var(--category-bar-width);
  max-width: 100%;
  font-size: $font-size-base * 0.875;
  line-height: 1.2;
  border-radius: 0.25rem;
  color: inherit;
  background-color: var(--category-bar-color);
  transition: $transition;
  transition-property: color, background-color;

  &:not(.caption-outside) {
    color: var(--category-text-color);
  }

  &:hover {
    text-decoration: none;
    color: var(--primary);
    background-color: var(--primary);

    &:not(.caption-outside) {
      color: var(--on-primary);
    }
  }
}

.category-link-caption {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
  opacity: 0;
  transition: $transition;
  transition-property: opacity;

  .caption-outside & {
    left: 100%;
  }

  .caption-visible & {
    opacity: 1;
  }
}

.category-total {
  font-family: $font-family-alternate;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
}

.category-name {
  opacity: 0.75;
}
</style>
