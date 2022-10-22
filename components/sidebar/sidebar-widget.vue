<template>
  <div class="sidebar-widget">
    <div class="widget-header">
      <h5 class="widget-title">{{ title }}</h5>
    </div>
    <div class="widget-body">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-widget {
  border-radius: $card-border-radius;
  color: $card-color;
  background-color: $card-bg;
}

.widget-header {
  padding: $card-padding-y $card-padding-x 0;
}

.widget-body {
  padding: $card-padding-y $card-padding-x;
}

.widget-title {
  margin-bottom: 0;
  text-align: center;
}
</style>

<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()
</script>
