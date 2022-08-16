<template>
  <div>
    <UiButton class="test-button" icon="home-24" size="lg" block> test button </UiButton>
    <UiButton :to="{ path: '/test' }" class="test-button" icon="home-24" variant="info" icon-right>
      test link button
    </UiButton>
  </div>
</template>
