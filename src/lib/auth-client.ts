'use client';

import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8080').trim(),
});

export const { signIn, signOut, signUp, useSession } = authClient;
