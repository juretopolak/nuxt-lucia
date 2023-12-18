import { z } from 'zod'
import { LuciaError } from 'lucia'

export default eventHandler(async (event) => {
  // Validate the body of the request
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  const user = await readValidatedBody(event, userSchema.parse)

  try {
    // find user by key and validate password
    const key = await auth.useKey('email', user.email.toLowerCase(), user.password)
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    })
    const authRequest = auth.handleRequest(event)
    authRequest.setSession(session)
    return key.userId
  }
  catch (e) {
    console.log(e)
    if (e instanceof LuciaError && (e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')) {
      // user does not exist or password is incorrect
      throw createError({
        message: 'Incorrect username or password.',
        statusCode: 400,
      })
    }
    throw createError({
      message: 'An unknown error occurred.',
      statusCode: 500,
    })
  }
})
