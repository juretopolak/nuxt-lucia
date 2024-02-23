import { verifyRequestOrigin } from 'lucia'
import type { Session, User } from 'lucia'
import { serializeCookie } from 'oslo/cookie'

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader]))
      return event.node.res.writeHead(403).end()
  }

  const sessionId = getCookie(event, auth.sessionCookieName) ?? null
  if (!sessionId) {
    event.context.session = null
    event.context.user = null
    return
  }

  const { session, user } = await auth.validateSession(sessionId)
  if (session && session.fresh)
    appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())

  if (session) {
    // Set cookie about auth session expire time which can be used on front-end
    appendHeader(event, 'Set-Cookie', serializeCookie(
      'auth_session_expire',
      session.expiresAt.getTime().toString(),
      {
        expires: session.expiresAt,
        path: '/',
        sameSite: 'lax',
      },
    ))
  }
  else {
    appendHeader(event, 'Set-Cookie', auth.createBlankSessionCookie().serialize())
    appendHeader(event, 'Set-Cookie', serializeCookie(
      'auth_session_expire',
      Date.now().toString(),
      {
        expires: new Date(),
        path: '/',
        sameSite: 'lax',
      },
    ))
  }

  event.context.session = session
  event.context.user = user
})

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
