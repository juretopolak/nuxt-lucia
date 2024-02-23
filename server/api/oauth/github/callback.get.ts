import { OAuth2RequestError } from 'arctic'
import { generateId } from 'lucia'
import { and, eq } from 'drizzle-orm'
import { H3Error } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    const githubUser: GitHubUser = await githubUserResponse.json()

    const existingUser = await useDb()
      .select()
      .from(models.oauthAccounts)
      .where(
        and(
          eq(models.oauthAccounts.providerId, 'github'),
          eq(models.oauthAccounts.providerUserId, githubUser.id),
        ),
      )
      .get()

    if (existingUser) {
      const session = await auth.createSession(existingUser.userId, {})
      appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())
      return sendRedirect(event, '/')
    }

    const email = (githubUser.email.length > 0) ? githubUser.email : null

    const userId = generateId(15)

    await useDb()
      .insert(models.users)
      .values({
        id: userId,
        name: githubUser.name,
        email,
      })

    await useDb()
      .insert(models.oauthAccounts)
      .values({
        userId,
        providerId: 'github',
        providerUserId: githubUser.id,
      })

    const session = await auth.createSession(userId, {})
    appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())

    return sendRedirect(event, '/')
  }
  catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      throw createError({
        status: 400,
      })
    }
    else if (e instanceof H3Error) {
      throw createError({
        status: 500,
        message: e.message,
      })
    }
    else {
      console.log(e)
      throw createError({
        status: 500,
        message: 'Unknown error.',
      })
    }
  }
})
