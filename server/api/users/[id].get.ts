import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId) {
    throw createError({
      message: 'User ID is required.',
      statusCode: 400,
    })
  }
  const user = await useDb()
    .select()
    .from(models.users)
    .where(eq(models.users.id, userId))
    .get()

  return user
})
