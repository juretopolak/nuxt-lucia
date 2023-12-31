import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')

  if (!userId)
    return

  try {
    const deletedUser = await useDb()
      .delete(models.users)
      .where(eq(models.users.id, userId))
      .returning()
      .get()
    return deletedUser
  }
  catch (e) {
    console.log(e)
    throw createError({
      message: 'An unknown error occurred.',
      statusCode: 500,
    })
  }
})
