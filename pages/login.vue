<script setup lang="ts">
import { FetchError } from 'ofetch'

const user = ref({
  email: 'jure@test.com',
  password: 'jure',
})

const loading = ref(false)

const userLogin = async () => {
  loading.value = true
  const toast = useToast()
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: user.value,
    })

    await navigateTo('/')
    toast.add({
      title: 'Login successful.',
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green'
    })
  } catch (e) {
    if (e instanceof FetchError) {
      toast.add({
        title: e.data.message,
        icon: 'i-heroicons-exclamation-triangle-20-solid',
        color: 'red'
      })
    }
    else {
      toast.add({
        title: 'Something went wrong. Check console',
        icon: 'i-heroicons-exclamation-triangle-20-solid',
        color: 'red'
      })
      console.log(e)
    }
  }
  loading.value = false
}
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

      <UButton :loading="loading" class="mt-4" size="lg" @click="userLogin">
        Login
      </UButton>
    </UCard>
  </div>
</template>