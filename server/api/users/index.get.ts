export default defineEventHandler(async (event) => {
  const users = useDb().select().from(models.users).all()
  return users
})