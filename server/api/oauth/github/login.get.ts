export default eventHandler(async (event) => {
  const [url, state] = await githubAuth.getAuthorizationUrl()
  setCookie(event, 'github_oauth_state', state, {
    httpOnly: true,
    secure: !process.dev,
    path: '/',
    maxAge: 24 * 60 * 60,
  })
  return sendRedirect(event, url.toString())
})
