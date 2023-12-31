<script setup lang="ts">
const auth = useAuthStore()
const { data: users } = await useFetch('/api/users')

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'actions' },
]

async function deleteUser(id: string) {
  const deletedUser = await $fetch(`/api/users/${id}`, { method: 'DELETE' })
  const toast = useToast()

  if (deletedUser && users.value) {
    users.value = users.value.filter(user => user.id !== deletedUser.id)
    toast.add({
      title: `User ${deletedUser.name} deleted.`,
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green',
    })
  }
  else {
    toast.add({
      title: 'Something went wrong.',
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      color: 'red',
    })
  }
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
