<template>
  <TransactionPage />
</template>

<script setup lang="ts">
const route = useRoute()

const viewMode = String(route.params.view)

if (!['expense', 'income'].includes(viewMode)) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}
</script>
