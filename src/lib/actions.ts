'use server';

import { isAxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { serverClient } from './server-client';

export async function addRepository(
  repoId: number,
  fullName: string,
): Promise<ActionResult> {
  try {
    const res = await serverClient.post('/repositories', { repoId, fullName });
    console.log(res);
    revalidatePath('/repositories');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function updateRepository(
  id: string,
  payload: { enabledAgents: AgentType[]; severityThreshold: Severity },
): Promise<void> {
  await serverClient.patch(`/repositories/${id}`, payload);
  revalidatePath('/repositories');
}

export async function toggleRepositoryActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    await serverClient.patch(`/repositories/${id}`, { isActive });
    revalidatePath('/repositories');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function saveApiKey(
  provider: ApiProvider,
  key: string,
): Promise<ActionResult> {
  try {
    await serverClient.put(`/settings/api-keys/${provider}`, { key });
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function deleteApiKey(
  provider: ApiProvider,
): Promise<ActionResult> {
  try {
    await serverClient.delete(`/settings/api-keys/${provider}`);
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function retryReview(reviewId: string): Promise<ActionResult> {
  try {
    await serverClient.post(`/reviews/${reviewId}/retry`);
    revalidatePath(`/reviews/${reviewId}`);
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function setPreferredProvider(
  provider: ReviewProvider | null,
): Promise<ActionResult> {
  try {
    await serverClient.put('/settings/preferred-provider', { provider });
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function setPreferredModel(
  model: string | null,
): Promise<ActionResult> {
  try {
    await serverClient.put('/settings/preferred-model', { model });
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function getOllamaModels(url?: string): Promise<{
  models: string[];
  error?: string;
}> {
  try {
    const params = url ? `?url=${encodeURIComponent(url)}` : '';
    const { data } = await serverClient.get<{
      models: string[];
      error?: string;
    }>(`/settings/ollama-models${params}`);
    return data;
  } catch {
    return { models: [], error: 'Failed to reach backend' };
  }
}

export async function setPreferredModelWithProvider(
  model: string | null,
  provider: ReviewProvider | null,
): Promise<ActionResult> {
  try {
    await serverClient.put('/settings/preferred-model', { model, provider });
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}

export async function setOllamaUrl(url: string | null): Promise<ActionResult> {
  try {
    await serverClient.put('/settings/ollama-url', { url: url || null });
    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (err) {
    if (isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      const message: string =
        err.response?.data?.message ?? 'An unexpected error occurred';
      return { success: false, status, message };
    }
    return {
      success: false,
      status: 500,
      message: 'An unexpected error occurred',
    };
  }
}
