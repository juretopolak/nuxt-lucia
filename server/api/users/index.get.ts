export default defineEventHandler(async () => {
  const users = useDb().select().from(models.users).all()
  return users
})
