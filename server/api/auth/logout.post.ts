import { serializeCookie } from 'oslo/cookie'

export default defineEventHandler(async (event) => {
  if (!event.context.session) {
    throw createError({
      statusCode: 403,
    })
  }
  await auth.invalidateSession(event.context.session.id)
  appendHeader(event, 'Set-Cookie', serializeCookie(
    'auth_session_expire',
    event.context.session.expiresAt.getTime().toString(),
    {
      expires: new Date(),
      path: '/',
    },
  ))
  return sendRedirect(event, '/login')
})
