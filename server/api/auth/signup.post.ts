import { z } from 'zod'
import { SqliteError } from 'better-sqlite3'
import { generateId } from 'lucia'
import { Argon2id } from 'oslo/password'

export default eventHandler(async (event) => {
  // Validate the body of the request
  const userSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    password: z.string(),
  })
  const userData = await readValidatedBody(event, userSchema.parse)

  const hashedPassword = await new Argon2id().hash(userData.password)
  const userId = generateId(32)

  try {
    const user = await useDb()
      .insert(models.users)
      .values({
        ...userData,
        id: userId,
        password: hashedPassword,
      })
      .returning()

    const session = await auth.createSession(userId, {})
    appendHeader(event, 'Set-Cookie', auth.createSessionCookie(session.id).serialize())

    if (!user) {
      throw createError({
        message: 'Email already in use.',
        statusCode: 409,
      })
      return
    }

    // eslint-disable-next-line unused-imports/no-unused-vars
    const { password, ...userWithoutPassword } = user[0]
    return userWithoutPassword
  }
  catch (e) {
    if (e instanceof SqliteError && e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        message: 'Email already in use.',
        statusCode: 409,
      })
    }
    console.log(e)
    throw createError({
      message: 'An unknown error occurred.',
      statusCode: 500,
    })
  }
})
