<script setup lang="ts">
const auth = useAuthStore()
const { data: users } = await useFetch('/api/users')

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'actions' },
]

async function deleteUser(id: string) {
  const { data: deletedUser } = await useFetch(`/api/users/${id}`, { method: 'DELETE' })

  if (deletedUser.value && users.value)
    users.value = users.value.filter(user => user.id !== deletedUser.value?.id)
}
</script>

<template>
  <UCard>
    <template #header>
      Users
    </template>
    <UTable :rows="users || []" :columns="columns">
      <template #actions-data="{ row }">
        <UButton v-if="auth.user" @click="deleteUser(row.id)">
          Delete
        </UButton>
        <div v-else />
      </template>
    </utable>
  </UCard>
</template>
