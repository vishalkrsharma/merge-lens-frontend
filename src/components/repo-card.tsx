"use client";

import { useState } from "react";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AgentBadge } from "@/components/agent-badge";
import type { AgentType, Repository, Severity } from "@/data/mock";

interface RepoCardProps {
  repo: Repository;
}

const ALL_AGENTS: AgentType[] = ["bug", "security", "performance", "style"];

export function RepoCard({ repo }: RepoCardProps) {
  const [enabledAgents, setEnabledAgents] = useState<Set<AgentType>>(new Set(repo.enabledAgents));
  const [threshold, setThreshold] = useState<Severity>(repo.severityThreshold);

  function toggleAgent(agent: AgentType) {
    setEnabledAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) next.delete(agent); else next.add(agent);
      return next;
    });
  }

  const installedDate = new Date(repo.installedAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 font-mono text-sm">
              <IconBrandGithub size={16} className="text-muted-foreground" />
              {repo.owner}/{repo.repo}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Installed {installedDate}</p>
          </div>
          <a
            href={`https://github.com/${repo.owner}/${repo.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <IconExternalLink size={14} />
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Enabled agents</p>
          <div className="space-y-2">
            {ALL_AGENTS.map((agent) => (
              <div key={agent} className="flex items-center justify-between">
                <AgentBadge agent={agent} />
                <Switch
                  checked={enabledAgents.has(agent)}
                  onCheckedChange={() => toggleAgent(agent)}
                  className="scale-90"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">Min severity</p>
          <Select value={threshold} onValueChange={(v) => setThreshold(v as Severity)}>
            <SelectTrigger className="h-7 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="font-mono text-xs">
            Installation #{repo.installationId}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
