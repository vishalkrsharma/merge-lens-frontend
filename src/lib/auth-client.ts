'use client';

import { createAuthClient } from 'better-auth/react';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
