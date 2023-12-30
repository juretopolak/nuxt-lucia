<script setup lang="ts">
const user = ref<UserLoginInput>({
  email: 'jure@test.com',
  password: 'jure',
})

const auth = useAuthStore()
</script>

<template>
  <div>
    <UCard>
      <template #header>
        Login
      </template>

      <UFormGroup label="Email" class="w-64">
        <UInput v-model="user.email" placeholder="Email" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Psasword" class="w-64 mt-4">
        <UInput v-model="user.password" type="password" placeholder="Password" icon="i-heroicons-lock-closed" />
      </UFormGroup>

      <UButton :loading="auth.loading" class="mt-4" size="lg" @click="auth.userLogin(user)">
        Login
      </UButton>
    </UCard>
  </div>
</template>
