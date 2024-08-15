<template>
  <div class="container py-32">
    <div class="row">
      <div class="col-md-8 col-lg-6 col-xl-4 col-offset-md-2 col-offset-lg-3 col-offset-xl-4 col-form">
        <form action="/api/register" method="post">
          <label for="username">Имя пользователя (e-mail)</label>
          <div class="mb-16">
            <input name="username" type="email" />
          </div>

          <label for="password">Пароль</label>
          <div class="mb-16">
            <input name="password" type="password" />
          </div>

          <button type="submit">Отправить</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})
</script>
