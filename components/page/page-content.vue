<template>
  <main :class="{ loading: loading }" class="page-content">
    <header v-if="hasHeader" class="page-content-header">
      <slot name="header">
        <UiButton
          :title="useString('home')"
          :aria-label="useString('home')"
          to="/"
          icon="arrow-left-24"
          icon-size="24"
          variant="link"
          class="btn-back d-lg-none"
        />
        <h1 class="h4 card-title">{{ title }}</h1>
      </slot>
    </header>
    <div v-if="hasContent" class="page-content-body">
      <slot />
      <UiSpinner v-if="loading" :variant="spinnerVariant" />
    </div>
    <footer v-if="hasFooter" class="page-content-footer">
      <slot name="footer" />
    </footer>
  </main>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
  spinnerVariant?: string
  title?: string
}>()
const slots = useSlots()

const hasContent = computed(() => Boolean(slots.default))
const hasHeader = computed(() => Boolean(slots.header || props.title))
const hasFooter = computed(() => Boolean(slots.footer))
</script>

<style lang="scss" scoped>
.page-content-header {
  display: flex;
  align-items: center;
  padding: ($grid-gap * 0.5) 0;
}

.page-content-body {
  position: relative;
  opacity: 1;
  transition: $transition;
  transition-property: opacity;

  .loading & {
    opacity: 0.5;
  }

  :deep(.spinner) {
    position: absolute;
  }
}

.page-content-footer {
  padding: ($grid-gap * 0.5) 0;
}

.btn-back {
  margin: 0 0.5rem 0 -0.5rem;
  padding: 0.5rem;
}

@include media-max-width(lg) {
  .page-content-body {
    :deep(.spinner) {
      right: 0.5rem;
      top: 0.5rem;
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

@include media-min-width(lg) {
  .page-content {
    border-radius: $card-border-radius;
    color: $card-color;
    background-color: $card-bg;
  }

  .page-content-header {
    padding: 1.25rem 1rem;
    color: var(--primary);
  }

  .page-content-body {
    padding: 1.25rem 1rem;

    .page-content-header + & {
      border-top: $border-width solid var(--primary-outline);
    }

    :deep(.spinner) {
      right: 1rem;
      top: 1rem;
    }
  }

  .page-content-footer {
    padding: 1rem;
    border-top: $border-width solid var(--primary-outline);
  }
}
</style>
