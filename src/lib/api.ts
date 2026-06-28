import { serverClient } from './server-client';

function buildQS(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && value !== 'all') qs.set(key, value);
  }
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export async function getStats(): Promise<Stats> {
  const { data } = await serverClient.get<Stats>('/stats');
  return data;
}

export async function listReviews(params?: {
  q?: string;
  repo?: string;
  status?: string;
  page?: string;
  limit?: string;
}): Promise<{ data: Review[]; total: number }> {
  const { data } = await serverClient.get<{ data: Review[]; total: number }>(
    `/reviews${buildQS(params ?? {})}`,
  );
  return data;
}

export async function getReview(id: string): Promise<ReviewDetail> {
  const { data } = await serverClient.get<ReviewDetail>(`/reviews/${id}`);
  return data;
}

export async function listFindings(params?: {
  agent?: string;
  severity?: string;
  repo?: string;
  file?: string;
  page?: string;
  limit?: string;
}): Promise<{ data: Finding[]; total: number }> {
  const { data } = await serverClient.get<{ data: Finding[]; total: number }>(
    `/findings${buildQS(params ?? {})}`,
  );
  return data;
}

export async function getHotspots(
  limit = 5,
): Promise<{ file: string; count: number }[]> {
  const { data } = await serverClient.get<{ file: string; count: number }[]>(
    `/findings/hotspots?limit=${limit}`,
  );
  return data;
}

export async function listRepositories(): Promise<Repository[]> {
  const { data } = await serverClient.get<Repository[]>('/repositories');
  return data;
}

export async function listAvailableRepositories(): Promise<GithubRepo[]> {
  const { data } = await serverClient.get<GithubRepo[]>(
    '/repositories/available',
  );
  return data;
}

export async function syncRepositories(): Promise<SyncResult> {
  const { data } = await serverClient.post<SyncResult>('/repositories/sync');
  return data;
}

export async function getUsage(): Promise<UsageStats> {
  const { data } = await serverClient.get<UsageStats>('/settings/usage');
  return data;
}

export async function getApiKeys(): Promise<ApiProvider[]> {
  const { data } = await serverClient.get<ApiProvider[]>('/settings/api-keys');
  return data;
}


export async function getModels(): Promise<ModelEntry[]> {
  const { data } = await serverClient.get<ModelEntry[]>('/settings/models');
  return data;
}

export async function getPreferredModel(): Promise<{ model: string | null; provider: string | null }> {
  const { data } = await serverClient.get<{ model: string | null; provider: string | null }>(
    '/settings/preferred-model',
  );
  return data;
}

export async function getOllamaUrl(): Promise<string | null> {
  const { data } = await serverClient.get<{ url: string | null }>(
    '/settings/ollama-url',
  );
  return data.url;
}
