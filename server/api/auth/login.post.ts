import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { Argon2id } from 'oslo/password'

export default eventHandler(async (event) => {
  // Validate the body of the request
  const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  const userData = await readValidatedBody(event, userSchema.parse)

  const user = await useDb()
    .select()
    .from(models.users)
    .where(eq(models.users.email, userData.email))
    .get()

  if (!user || !user.password) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const validPassword = await new Argon2id().verify(user.password, userData.password)

  if (!validPassword) {
    throw createError({
      message: 'Incorrect email or password',
      statusCode: 400,
    })
  }

  const session = await auth.createSession(user.id, {})
  appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
})
