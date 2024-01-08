import { OAuthRequestError } from '@lucia-auth/oauth'

export default eventHandler(async (event) => {
  const storedState = getCookie(event, 'github_oauth_state')
  const query = getQuery(event)
  const state = query.state?.toString()
  const code = query.code?.toString()
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return sendError(
      event,
      createError({
        statusCode: 400,
      }),
    )
  }
  try {
    const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code)

    console.log(githubUser)

    const getUser = async () => {
      const existingUser = await getExistingUser()
      if (existingUser)
        return existingUser
      if (!githubUser.email) {
        throw createError({
          message: 'Email is required.',
          statusCode: 400,
        })
      }
      const user = await createUser({
        attributes: {
          email: githubUser.email,
          username: githubUser.login,
          name: githubUser.name,
        },
      })
      return user
    }

    const user = await getUser()
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })
    const authRequest = auth.handleRequest(event)
    authRequest.setSession(session)
    return sendRedirect(event, '/') // redirect to profile page
  }
  catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return sendError(
        event,
        createError({
          statusCode: 400,
        }),
      )
    }
    console.log(e)
    return sendError(
      event,
      createError({
        statusCode: 500,
      }),
    )
  }
})
