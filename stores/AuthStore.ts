import { defineStore } from 'pinia'
import { FetchError } from 'ofetch'

export const useAuthStore = defineStore('AuthStore', () => {
  const user = ref<UserState>(null)
  const loading = ref(false)
  const sessionToastShown = ref(false)

  const toast = useToast()

  async function userRegistration(userInput: UserSignupInput) {
    loading.value = true
    const toast = useToast()
    try {
      user.value = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: userInput,
      })
      await navigateTo('/')
      toast.add({
        title: 'Registration sussesfull.',
        icon: 'i-heroicons-check-circle-20-solid',
        color: 'green',
      })
      toast.add({
        title: 'You are now logged in.',
        icon: 'i-heroicons-check-circle-20-solid',
        color: 'green',
      })
      getAuthenticatedUser()
    }
    catch (e) {
      if (e instanceof FetchError) {
        toast.add({
          title: e.data.message,
          icon: 'i-heroicons-exclamation-triangle-20-solid',
          color: 'red',
        })
      }
      else {
        toast.add({
          title: 'Something went wrong. Check console',
          icon: 'i-heroicons-exclamation-triangle-20-solid',
          color: 'red',
        })
        console.log(e)
      }
    }
    loading.value = false
  }

  async function userLogin(userInput: UserLoginInput) {
    loading.value = true
    try {
      // Create a session on the server
      user.value = await $fetch('/api/auth/login', {
        method: 'POST',
        body: userInput,
      })
      await navigateTo('/')
      toast.add({
        title: 'Login successful.',
        icon: 'i-heroicons-check-circle-20-solid',
        color: 'green',
      })
      // new request to create cookie with
      getAuthenticatedUser()
    }
    catch (e) {
      if (e instanceof FetchError) {
        toast.add({
          title: e.data.message,
          icon: 'i-heroicons-exclamation-triangle-20-solid',
          color: 'red',
        })
      }
      else {
        toast.add({
          title: 'Something went wrong. Check console',
          icon: 'i-heroicons-exclamation-triangle-20-solid',
          color: 'red',
        })
        console.log(e)
      }
    }
    loading.value = false
  }

  async function userLogout() {
    try {
      user.value = null
      await $fetch('/api/auth/logout', {
        method: 'POST',
      })
    }
    catch (error) {
      console.log(error)
    }
    await navigateTo('/login')
  }

  async function getAuthenticatedUser() {
    try {
      user.value = await $fetch('/api/auth/user')
      return user.value
    }
    catch (e) {
      // Don't show for expired session if there is no user
      if (!user.value)
        return

      user.value = null
      toast.add({
        title: 'Session expired. Please login again...',
        icon: 'i-heroicons-exclamation-triangle-20-solid',
        color: 'red',
      })
    }
  }

  // Show toast 15 min before session idle period expires
  async function checkSessionExpiration() {
    const sessionExpiresAt = useCookie('auth_session_expire')
    // console.log(sessionExpiresAt.value)

    const now = new Date()
    const diff = Math.round((Number(sessionExpiresAt.value) - now.getTime()) / 1000)

    if (diff < 0) {
      // console.log(diff)
      user.value = null
      sessionToastShown.value = false
      await navigateTo('/login')
      return
    }

    if (!sessionToastShown.value && diff <= (15 * 60)) {
      toast.add({
        title: `Session will expire in less than 15 minutes.`,
        icon: 'i-heroicons-exclamation-triangle-20-solid',
        color: 'yellow',
        timeout: diff * 1000,
        actions: [{
          label: 'Renew session',
          click: renewSession,
        }],
      })
      sessionToastShown.value = true
    }
  }

  async function renewSession() {
    getAuthenticatedUser()
    toast.add({
      title: 'Session renewed.',
      icon: 'i-heroicons-check-circle-20-solid',
      color: 'green',
    })
    sessionToastShown.value = false
  }

  return {
    user,
    loading,
    sessionToastShown,
    userRegistration,
    userLogin,
    userLogout,
    getAuthenticatedUser,
    checkSessionExpiration,
  }
}, { persist: false })
