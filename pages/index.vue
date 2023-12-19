<script setup lang="ts">
const { data: user } = await useFetch('/api/auth/user', {
  method: 'GET',
})
async function logout() {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST',
    })
  }
  catch (error) {
    console.log(error)
  }

  await navigateTo('/login')
}
</script>

<template>
  <div>
    <UCard>
      <template #header>
        Home
      </template>
      <div v-if="user">
        Hello, {{ user.email }}
        <UButton @click="logout">
          Logout
        </UButton>
      </div>
      <div v-else>
        User not logged in.
      </div>
    </UCard>
  </div>
</template>
