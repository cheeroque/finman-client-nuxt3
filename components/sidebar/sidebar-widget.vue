<template>
  <div class="card">
    <div class="card-header">
      <h5 class="card-title text-center">{{ title }}</h5>
    </div>

    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface SidebarWidgetProps {
  title?: string
}

const props = defineProps<SidebarWidgetProps>()
</script>
