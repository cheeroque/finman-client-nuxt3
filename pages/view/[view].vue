<template>
  <PageRecords />
</template>

<script setup lang="ts">
const route = useRoute()
const viewMode = route.params.view as string

if (!['expense', 'income'].includes(viewMode)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}
</script>
