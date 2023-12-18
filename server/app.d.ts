/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('./utils/auth').Auth
  interface DatabaseUserAttributes {
    email: string
    name: string
  }
  interface DatabaseSessionAttributes {}
}
