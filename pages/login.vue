<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-4 col-offset-md-2 col-offset-lg-3 col-offset-xl-4 col-form">
        <form class="card h-auto" @submit.prevent="submitForm">
          <div class="card-header">
            <h3 class="card-title text-center">{{ useString('login') }}</h3>
          </div>

          <div class="card-body">
            <UiFormGroup
              :invalid-feedback="useFieldErrorMessage(username)"
              :label="useString('userName')"
              :state="useFieldState(username)"
            >
              <UiInput
                v-model="username.value.value"
                :disabled="loading"
                :placeholder="useString('userNamePlaceholder')"
              />
            </UiFormGroup>

            <UiFormGroup
              :invalid-feedback="useFieldErrorMessage(password)"
              :label="useString('password')"
              :state="useFieldState(password)"
              class="mb-0"
            >
              <UiInput v-model="password.value.value" :disabled="loading" type="password" />
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
          <p
            v-if="useFieldState(submitError) === false"
            :key="useFieldErrorMessage(submitError)"
            class="form-feedback form-feedback-invalid"
          >
            {{ useFieldErrorMessage(submitError) }}
          </p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { string as yupString } from 'yup'

import type { LoginMutationVariables } from '~/gen/gql/graphql'

type LoginFormValues = LoginMutationVariables & {
  submitError: null
}

definePageMeta({
  layout: 'auth',
})

const user = useSession()

const loading = ref(false)

const { handleSubmit, setFieldError, values } = useForm<LoginFormValues>({
  initialValues: {
    password: '',
    submitError: null,
    username: '',
  },

  validationSchema: {
    password: yupString().required(useString('fieldRequired')),
    username: yupString().required(useString('fieldRequired')),
  },
})

const password = useField<string>('password')
const username = useField<string>('username')
const submitError = useField<null>('submitError')

const submitForm = handleSubmit(async () => {
  loading.value = true

  const { data, error } = await useFetch('/api/login', {
    method: 'POST',
    body: values,
  })

  if (data.value?.user) {
    user.value = data.value.user

    return navigateTo('/')
  }

  if (error.value) {
    const messageKey = error.value.statusCode === 401 ? 'invalidCredentials' : 'errorMessage'
    setFieldError('submitError', useString(messageKey))
  }

  loading.value = false
})
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
