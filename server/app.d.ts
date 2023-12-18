/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./utils/auth").Auth
  type DatabaseUserAttributes = {
    email: string,
    name: string
  };
  type DatabaseSessionAttributes = {}
}