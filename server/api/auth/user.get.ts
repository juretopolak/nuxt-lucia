import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = event.context.session

  if (!session?.userId) {
    throw createError({
      message: 'Not logged in.',
      statusCode: 401,
    })
  }

  const user = await useDb()
    .select()
    .from(models.users)
    .where(eq(models.users.id, session.userId))
    .get()

  if (!user) {
    throw createError({
      message: 'User not found by the ID from the session.',
      statusCode: 404,
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { password, ...userWithoutPassword } = user

  return userWithoutPassword
})
