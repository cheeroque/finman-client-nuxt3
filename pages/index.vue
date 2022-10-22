<template>
  <div class="p-32">
    {{ categories.data }}
  </div>
</template>

<script setup lang="ts">
import { useApiFetch } from '@/composables/useApiFetch'

const { data: categories } = await useAsyncData(() => useApiFetch('categories'))
</script>
