import { z } from 'zod'
import { LuciaError } from 'lucia'

export default eventHandler(async (event) => {
  // Validate the body of the request
  const userSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string(),
  })
  const user = await readValidatedBody(event, userSchema.parse)

  try {
    const newUser = await auth.createUser({
      key: {
        providerId: 'email',
        providerUserId: user.email,
        password: user.password
      },
      attributes: {
        email: user.email
      },
    });
    const session = await auth.createSession({
      userId: newUser.userId,
      attributes: {}
    })
    const authRequest = auth.handleRequest(event)
    authRequest.setSession(session)
    return newUser.userId
  } catch (e) {
    if (
      e instanceof LuciaError && e.message === 'AUTH_DUPLICATE_KEY_ID'
    ) {
      throw createError({
        message: 'Email already in use.',
        statusCode: 409
      });
    }
    throw createError({
      message: 'An unknown error occurred.',
      statusCode: 500
    });
  }
})