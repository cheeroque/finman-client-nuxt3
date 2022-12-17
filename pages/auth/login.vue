<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-4 col-offset-md-2 col-offset-lg-3 col-offset-xl-4">
        <form class="card" @submit.prevent="handleSubmit">
          <div class="card-header">
            <h3 class="card-title text-center">{{ useString('login') }}</h3>
          </div>
          <div class="card-body">
            <UiFormGroup :label="useString('userName')">
              <UiInput v-model="credentials.name" :placeholder="useString('userNamePlaceholder')" />
            </UiFormGroup>
            <UiFormGroup :label="useString('password')" class="mb-0">
              <UiInput v-model="credentials.password" type="password" />
            </UiFormGroup>
          </div>
          <div class="card-footer text-right">
            <UiButton type="submit" variant="secondary" class="px-24">
              {{ useString('login') }}
            </UiButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'

definePageMeta({
  auth: false,
  layout: 'auth',
})

const { signIn } = useSession()

const credentials: Ref<LoginCredentials> = ref({
  name: '',
  password: '',
})

async function handleSubmit() {
  try {
    await signIn('credentials', {
      callbackUrl: '/',
      redirect: true,
      name: credentials.value.name,
      password: credentials.value.password,
    })
  } catch (error) {}
}
</script>
