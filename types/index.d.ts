import type { SelectUser } from '@/server/db/schema'

declare global {
  interface UserLoginInput {
    email: string
    password: string
  }

  interface UserSignupInput {
    name: string
    email: string
    password: string
  }

  interface UserState extends SelectUser {
    session: {
      activePeriodExpiresAt: string
      idlePeriodExpiresAt: string
    }
  }
}
