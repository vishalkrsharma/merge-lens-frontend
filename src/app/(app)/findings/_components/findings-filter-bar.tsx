"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Repository } from "@/lib/types";

export function FindingsFilterBar({ repos }: { repos: Repository[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") params.set(key, value);
      else params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Select defaultValue={searchParams.get("agent") ?? undefined} onValueChange={(v) => update("agent", v)}>
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue placeholder="All agents" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All agents</SelectItem>
          <SelectItem value="bug">Bug</SelectItem>
          <SelectItem value="security">Security</SelectItem>
          <SelectItem value="performance">Performance</SelectItem>
          <SelectItem value="style">Style</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("severity") ?? "all"} onValueChange={(v) => update("severity", v)}>
        <SelectTrigger className="h-8 w-36 text-sm">
          <SelectValue placeholder="All severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={searchParams.get("repo") ?? "all"} onValueChange={(v) => update("repo", v)}>
        <SelectTrigger className="h-8 w-44 text-sm">
          <SelectValue placeholder="All repos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All repos</SelectItem>
          {repos.map((r) => (
            <SelectItem key={r.id} value={`${r.owner}/${r.repo}`}>
              {r.owner}/{r.repo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Filter by file…"
        className="h-8 w-52 text-sm"
        defaultValue={searchParams.get("file") ?? ""}
        onChange={(e) => update("file", e.target.value)}
      />
    </div>
  );
}
