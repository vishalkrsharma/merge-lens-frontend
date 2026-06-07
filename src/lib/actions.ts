'use server';

import { revalidatePath } from 'next/cache';
import { isAxiosError } from 'axios';
import type { AgentType, Severity } from './types';
import { serverClient } from './server-client';

type ActionResult<T = void> = { success: true; data: T } | { success: false; status: number; message: string };

export async function addRepository(repoId: number, fullName: string): Promise<ActionResult> {
  try {
    const res = await serverClient.post('/repositories', { repoId, fullName });
    console.log(res);
    revalidatePath('/repositories');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string = err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return { success: false, status: 500, message: 'An unexpected error occurred' };
  }
}

export async function updateRepository(id: string, payload: { enabledAgents: AgentType[]; severityThreshold: Severity }): Promise<void> {
  await serverClient.patch(`/repositories/${id}`, payload);
  revalidatePath('/repositories');
}
