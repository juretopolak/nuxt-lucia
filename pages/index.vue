<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <div>
    <UCard>
      <template #header>
        Home
      </template>
      <div v-if="auth.user">
        Hello, {{ auth.user?.email }}
        <UButton @click="auth.userLogout()">
          Logout
        </UButton>
      </div>
      <div v-else>
        User not logged in.
      </div>
    </UCard>
  </div>
</template>
