/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./utils/auth').Auth
  interface DatabaseUserAttributes {
    email: string
    username: string | null
    name: string | null
  }
  interface DatabaseSessionAttributes {}
}
