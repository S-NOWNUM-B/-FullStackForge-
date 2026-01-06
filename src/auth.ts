/* eslint-disable @typescript-eslint/no-require-imports */
const NextAuth = require('next-auth').default;
const { authConfig } = require('./auth.config');

const result = NextAuth(authConfig);

export const handlers = result.handlers;
export const auth = result.auth;
export const signIn = result.signIn;
export const signOut = result.signOut;
