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

  interface GitHubUser {
    id: string
    name: string
    email: string
    avatar_url: string
  }

  type UserState = Omit<SelectUser, 'password'> | null
}
