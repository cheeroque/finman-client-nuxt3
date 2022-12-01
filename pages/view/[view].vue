<template>
  <PageRecords />
</template>

<script setup lang="ts">
const route = useRoute()
const viewMode = route.params.view as string

if (!['expense', 'income'].includes(viewMode)) {
  showError({ statusCode: 404 })
}
</script>
