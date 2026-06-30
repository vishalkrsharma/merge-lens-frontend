'use client';

import { createAuthClient } from 'better-auth/react';
import { organizationClient } from 'better-auth/client/plugins';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL?.trim();

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [organizationClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;
