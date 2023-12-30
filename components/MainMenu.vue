<script setup lang="ts">
const links = ref([
  {
    label: 'Home',
    icon: 'i-heroicons-home-solid',
    to: '/',
  },
  {
    label: 'List Users',
    icon: 'i-heroicons-users-solid',
    to: '/users',
  },
  {
    label: 'Signup',
    icon: 'i-heroicons-users-solid',
    to: '/signup',
  },
  {
    label: 'Login',
    icon: 'i-heroicons-users-solid',
    to: '/login',
  },
])
</script>

<template>
  <div>
    <UVerticalNavigation :links="links" :ui="{ padding: 'p-3' }">
      <template #icon="{ link }">
        <UIcon :name="link.icon" class="text-base" />
      </template>
    </UVerticalNavigation>
  </div>
</template>
