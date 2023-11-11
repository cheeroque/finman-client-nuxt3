<template>
  <main class="container container-error">
    <h1 class="fw-medium mb-32">
      {{ errorTitle }}
    </h1>
    <p class="fs-20 mb-32">
      {{ errorMessage }}
    </p>
    <a href="#" @click.prevent="handleError"> {{ useString('backHome') }} </a>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorTitle = `${useString('error')} ${props.error.statusCode}`
const errorMessage = useString(`errorMessage${props.error.statusCode}`)

useHead({
  title: errorTitle,
  bodyAttrs: {
    class: 'body-error',
  },
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style lang="scss" scoped>
.container-error {
  padding-top: 4rem;
  padding-bottom: 4rem;
  text-align: center;

  a {
    text-decoration: underline;
    color: var(--danger);
  }
}

@include media-min-width(lg) {
  .container-error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
  }
}
</style>
