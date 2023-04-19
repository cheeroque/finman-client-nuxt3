<template>
  <UiButton icon="logout-24" icon-size="24" class="drawer-item" @click="logout">
    <span class="caption">{{ useString('logout') }}</span>
  </UiButton>
</template>

<script lang="ts" setup>
import LOGOUT_MUTATION from '@/graphql/Logout.gql'

const { onLogout } = useApollo()

function logout() {
  const { mutate } = useMutation(LOGOUT_MUTATION)

  mutate().then(() => {
    onLogout().then(() => {
      navigateTo('/auth/login')
    })
  })
}
</script>
