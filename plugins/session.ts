// Every minute, check when session will expire and
// show a toast if it will expire in less than 15 min
export default defineNuxtPlugin((nuxtApp) => {
  const auth = useAuthStore()
  nuxtApp.hook('app:mounted', () => {
    auth.getAuthenticatedUser()

    auth.checkSessionExpiration()
    setInterval(() => {
      auth.checkSessionExpiration()
    }, 1000)
  })
})
