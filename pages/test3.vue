<script setup lang="ts">
const user = ref({
  email: '',
  password: '',
})

async function userLogin() {
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
      color: 'green',
    })
  }
  catch (e) {
    toast.add({
      // @ts-expect-error
      title: e.data.message,
      icon: 'i-heroicons-exclamation-triangle-20-solid',
      color: 'red',
    })
  }
}
</script>
