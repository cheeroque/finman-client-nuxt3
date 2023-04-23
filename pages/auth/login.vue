<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-4 col-offset-md-2 col-offset-lg-3 col-offset-xl-4 col-form">
        <form class="card h-auto" @submit.prevent="handleSubmit">
          <div class="card-header">
            <h3 class="card-title text-center">{{ useString('login') }}</h3>
          </div>

          <div class="card-body">
            <UiFormGroup :label="useString('userName')">
              <UiInput
                v-model="credentials.username"
                :placeholder="useString('userNamePlaceholder')"
                @input="submitError = undefined"
              />
            </UiFormGroup>

            <UiFormGroup :label="useString('password')" class="mb-0">
              <UiInput v-model="credentials.password" type="password" @input="submitError = undefined" />
            </UiFormGroup>
          </div>

          <div class="card-footer text-right">
            <UiButton type="submit" variant="secondary" class="px-24">
              {{ useString('login') }}
            </UiButton>
          </div>
        </form>

        <Transition name="fade" mode="out-in">
          <p v-if="submitError" :key="submitError" class="form-feedback form-feedback-invalid">{{ submitError }}</p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthError } from '~/plugins/auth'
import { LoginCredentials } from '~~/types/auth'

definePageMeta({
  isPublic: true,
  layout: 'auth',
})

const credentials = reactive<LoginCredentials>({
  username: '',
  password: '',
})

const loading = ref(false)

const submitError: Ref<string | undefined> = ref()

async function handleSubmit() {
  const { $auth } = useNuxtApp()

  loading.value = true

  try {
    await $auth.login(credentials)
  } catch (error: any) {
    if (error instanceof AuthError && error.code === '401') {
      submitError.value = useString('invalidCredentials')
    } else {
      submitError.value = useString('errorMessage')
    }
  }

  loading.value = false
}
</script>

<style lang="scss" scoped>
.col-form {
  position: relative;
  padding-bottom: 1.5rem;
}

.form-feedback {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
</style>
