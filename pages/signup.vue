<script setup lang="ts">
const user = ref<UserSignupInput>({
  name: 'Jure',
  email: 'jure@test.com',
  password: 'jure',
})

const auth = useAuthStore()
</script>

<template>
  <div>
    <UCard>
      <template #header>
        Register
      </template>

      <UFormGroup label="Name" class="w-64">
        <UInput v-model="user.name" placeholder="Name" icon="i-heroicons-user" />
      </UFormGroup>

      <UFormGroup label="Email" class="w-64 mt-4">
        <UInput v-model="user.email" placeholder="Email" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Psasword" class="w-64 mt-4">
        <UInput v-model="user.password" type="password" placeholder="Password" icon="i-heroicons-lock-closed" />
      </UFormGroup>

      <UButton :loading="auth.loading" class="mt-4" size="lg" @click="auth.userRegistration(user)">
        Register
      </UButton>
    </UCard>
  </div>
</template>
