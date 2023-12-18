<script setup lang="ts">
import { FetchError } from 'ofetch'

const user = ref({
  name: 'Jure',
  email: 'jure@test.com',
  password: 'jure',
})

const loading = ref(false)

const userRegistration = async () => {
  loading.value = true
  const toast = useToast()
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: user.value
    })
    toast.add({
      title: 'Registration sussesfull.',
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green'
    })

    await navigateTo('/')
    toast.add({
      title: 'You are now logged in.',
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green'
    })
  }
  catch (e) {
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

      <UButton :loading="loading" class="mt-4" size="lg" @click="userRegistration">
        Register
      </UButton>

    </UCard>
  </div>
</template>