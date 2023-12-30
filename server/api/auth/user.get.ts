import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  const userId = session?.user.userId

  console.log(session)

  if (!userId) {
    throw createError({
      message: 'Not logged in.',
      statusCode: 401,
    })
  }

  const user = await useDb()
    .select()
    .from(models.users)
    .where(eq(models.users.id, userId))
    .get()

  console.log(session.activePeriodExpiresAt)

  return {
    ...user,
    session: {
      activePeriodExpiresAt: session.activePeriodExpiresAt,
      idlePeriodExpiresAt: session.idlePeriodExpiresAt,
    },
  }
})
