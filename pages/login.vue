<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-4 col-offset-md-2 col-offset-lg-3 col-offset-xl-4 col-form">
        <form class="card h-auto" @submit.prevent="handleSubmit">
          <div class="card-header">
            <h3 class="card-title text-center">{{ useString('login') }}</h3>
          </div>

          <div class="card-body">
            <UiFormGroup
              :invalid-feedback="useValidationErrors(v$, 'username')"
              :label="useString('userName')"
              :state="useValidationState(v$, 'username')"
            >
              <UiInput
                v-model="credentials.username"
                :disabled="loading"
                :placeholder="useString('userNamePlaceholder')"
                @input="submitError = undefined"
              />
            </UiFormGroup>

            <UiFormGroup
              :invalid-feedback="useValidationErrors(v$, 'password')"
              :label="useString('password')"
              :state="useValidationState(v$, 'password')"
              class="mb-0"
            >
              <UiInput
                v-model="credentials.password"
                :disabled="loading"
                type="password"
                @input="submitError = undefined"
              />
            </UiFormGroup>
          </div>

          <div class="card-footer text-right">
            <UiButton :disabled="loading" class="px-24" type="submit" variant="secondary">
              <UiSpinner v-if="loading" class="nuxt-icon nuxt-icon-left" size="1em" />
              {{ useString('login') }}
            </UiButton>
          </div>
        </form>

        <Transition mode="out-in" name="fade">
          <p v-if="submitError" :key="submitError" class="form-feedback form-feedback-invalid">{{ submitError }}</p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'

import type { LoginCredentials } from '~/types'

definePageMeta({
  layout: 'auth',
})

const credentials = reactive<LoginCredentials>({
  password: '',
  username: '',
})

const loading = ref(false)
const submitError = ref<string | undefined>()

/* Form validation */
const rules = computed(() => ({
  password: { required: helpers.withMessage(useString('fieldRequired'), required) },
  username: { required: helpers.withMessage(useString('fieldRequired'), required) },
}))

const v$ = useVuelidate<LoginCredentials>(rules, credentials, { $lazy: true })

async function handleSubmit() {
  v$.value.$validate()

  if (!v$.value.$error) {
    const { $auth } = useNuxtApp()

    loading.value = true

    try {
      await $auth.login(credentials)

      return navigateTo('/')
    } catch (error: any) {
      const isAuthError = error?.statusCode === 401

      if (isAuthError) {
        submitError.value = useString('invalidCredentials')
      } else {
        submitError.value = useString('errorMessage')
      }
    }

    loading.value = false
  }
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
