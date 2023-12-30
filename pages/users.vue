<script setup lang="ts">
const { data: users } = await useFetch('/api/users')
</script>

<template>
  <UCard>
    <template #header>
      Users
    </template>
    <div
      v-for="user in users"
      :key="user.id"
    >
      {{ user.name }} - {{ user.email }}
    </div>
  </UCard>
</template>
