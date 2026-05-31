import { headers } from "next/headers";
import type { Finding, Repository, Review, ReviewDetail, Stats, UsageStats } from "./types";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

async function serverFetch<T>(path: string): Promise<T> {
  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";

  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function buildQS(params: Record<string, string | undefined>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value && value !== "all") qs.set(key, value);
  }
  const str = qs.toString();
  return str ? `?${str}` : "";
}

export function getStats(): Promise<Stats> {
  return serverFetch("/api/stats");
}

export function listReviews(params?: {
  q?: string;
  repo?: string;
  status?: string;
  page?: string;
  limit?: string;
}): Promise<{ data: Review[]; total: number }> {
  return serverFetch(`/api/reviews${buildQS(params ?? {})}`);
}

export function getReview(id: string): Promise<ReviewDetail> {
  return serverFetch(`/api/reviews/${id}`);
}

export function listFindings(params?: {
  agent?: string;
  severity?: string;
  repo?: string;
  file?: string;
  page?: string;
  limit?: string;
}): Promise<{ data: Finding[]; total: number }> {
  return serverFetch(`/api/findings${buildQS(params ?? {})}`);
}

export function getHotspots(limit = 5): Promise<{ file: string; count: number }[]> {
  return serverFetch(`/api/findings/hotspots?limit=${limit}`);
}

export function listRepositories(): Promise<Repository[]> {
  return serverFetch("/api/repositories");
}

export function getUsage(): Promise<UsageStats> {
  return serverFetch("/api/settings/usage");
}
