import type { EventHandler, EventHandlerRequest } from 'h3'

export function authEventHandler<T extends EventHandlerRequest, D>(handler: EventHandler<T, D>): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    try {
      const authRequest = auth.handleRequest(event)
      const session = await authRequest.validate()
      const userId = session?.user.userId
      console.log(session)

      if (!userId) {
        throw createError({
          message: 'Unauthorized.',
          statusCode: 401,
        })
      }

      const response = await handler(event)

      return response
    }
    catch (err) {
      // Error handling
      return err
    }
  })
}
