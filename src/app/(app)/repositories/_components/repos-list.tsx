'use client';

import {
  IconBrandGithub,
  IconCircleCheck,
  IconExternalLink,
  IconLoader2,
  IconLock,
  IconPlayerPause,
  IconPlus,
  IconSearch,
  IconSettings,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AgentBadge } from '@/components/agent-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { addRepository, toggleRepositoryActive } from '@/lib/actions';
import { openGithubPopup } from '@/lib/github-popup';
import { ConfigureSheet } from './configure-sheet';

const AGENT_ORDER: AgentType[] = ['bug', 'security', 'performance', 'style'];

type RepoItem = { kind: 'connected'; repo: Repository } | { kind: 'available'; repo: GithubRepo };

function getFullName(item: RepoItem) {
  return item.kind === 'connected' ? `${item.repo.owner}/${item.repo.repo}` : item.repo.fullName;
}

function getOwner(item: RepoItem) {
  return item.kind === 'connected' ? item.repo.owner : item.repo.fullName.split('/')[0];
}

interface ReposListProps {
  connectedRepos: Repository[];
  availableRepos: GithubRepo[];
  repositorySelection: 'all' | 'selected';
  installationId?: number;
}

export function ReposList({ connectedRepos, availableRepos, repositorySelection, installationId }: ReposListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const status = (searchParams.get('status') ?? 'all') as 'all' | 'active' | 'paused';
  const [addingId, setAddingId] = useState<number | null>(null);

  function handleQueryChange(value: string) {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function setStatus(value: string | null) {
    if (!value) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  const allItems: RepoItem[] = [
    ...connectedRepos.map((r): RepoItem => ({ kind: 'connected', repo: r })),
    ...availableRepos.map((r): RepoItem => ({ kind: 'available', repo: r })),
  ];

  const statusFiltered =
    status === 'all' ? allItems : allItems.filter((item) => item.kind === 'connected' && (status === 'active' ? item.repo.isActive : !item.repo.isActive));

  const filtered = query ? statusFiltered.filter((item) => getFullName(item).toLowerCase().includes(query.toLowerCase())) : statusFiltered;

  const grouped = new Map<string, RepoItem[]>();
  for (const item of filtered) {
    const owner = getOwner(item);
    if (!grouped.has(owner)) grouped.set(owner, []);
    grouped.get(owner)!.push(item);
  }

  async function handleAdd(repo: GithubRepo) {
    setAddingId(repo.id);
    try {
      const result = await addRepository(repo.id, repo.fullName);
      if (!result.success) {
        if (result.status === 401) {
          router.push('/');
          toast.error('Please re-login to continue');
        } else if (result.status === 404) {
          toast.error(result.message);
        } else {
          toast.error('GitHub is unavailable, try again');
        }
        return;
      }
      router.refresh();
      toast.success(`${repo.fullName} added to MergeLens`);
    } finally {
      setAddingId(null);
    }
  }

  const configureUrl = installationId ? `https://github.com/settings/installations/${installationId}` : 'https://github.com/settings/installations';

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        <div className='relative max-w-sm flex-1'>
          <IconSearch
            size={14}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
          />
          <Input
            placeholder='Search repositories…'
            className='pl-9'
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={setStatus}
        >
          <SelectTrigger className='w-32 shrink-0'>
            <SelectValue className='capitalize' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='paused'>Paused</SelectItem>
          </SelectContent>
        </Select>
        <Button
          size='default'
          variant='outline'
          className='gap-2 shrink-0'
          onClick={() => openGithubPopup(configureUrl, () => router.refresh())}
        >
          <IconSettings size={14} />
          Configure GitHub
        </Button>
      </div>

      {allItems.length === 0 ? (
        <NoReposState />
      ) : filtered.length === 0 ? (
        <SearchEmptyState
          query={query}
          repositorySelection={repositorySelection}
          installationId={installationId}
        />
      ) : (
        <div className='space-y-6'>
          {[...grouped.entries()].map(([owner, items]) => (
            <OwnerGroup
              key={owner}
              owner={owner}
              items={items}
              addingId={addingId}
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OwnerGroup({ owner, items, addingId, onAdd }: { owner: string; items: RepoItem[]; addingId: number | null; onAdd: (repo: GithubRepo) => void }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 px-0.5'>
        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary'>{owner[0].toUpperCase()}</div>
        <span className='text-sm font-medium'>{owner}</span>
        <span className='text-xs text-muted-foreground'>
          {items.length} {items.length === 1 ? 'repository' : 'repositories'}
        </span>
      </div>
      <div className='divide-y divide-border overflow-hidden rounded-xl border border-border'>
        {items.map((item) =>
          item.kind === 'connected' ? (
            <ConnectedRepoRow
              key={item.repo.id}
              repo={item.repo}
            />
          ) : (
            <AvailableRepoRow
              key={item.repo.id}
              repo={item.repo}
              addingId={addingId}
              onAdd={onAdd}
            />
          ),
        )}
      </div>
    </div>
  );
}

function ConnectedRepoRow({ repo }: { repo: Repository }) {
  const [isActive, setIsActive] = useState(repo.isActive);
  const [isToggling, setIsToggling] = useState(false);
  const orderedAgents = AGENT_ORDER.filter((a) => repo.enabledAgents.includes(a));

  const installedDate = new Date(repo.installedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  async function handleToggleActive(value: boolean) {
    setIsActive(value);
    setIsToggling(true);
    try {
      const result = await toggleRepositoryActive(repo.id, value);
      if (!result.success) {
        setIsActive(!value);
        toast.error('Failed to update repository — try again');
      }
    } finally {
      setIsToggling(false);
    }
  }

  return (
    <div className='flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/20 first:rounded-t-xl last:rounded-b-xl'>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <IconBrandGithub
            size={15}
            className='shrink-0 text-muted-foreground'
          />
          <a
            href={`https://github.com/${repo.owner}/${repo.repo}`}
            target='_blank'
            rel='noopener noreferrer'
            className='group/link flex items-center gap-1 font-medium hover:text-primary'
          >
            {repo.repo}
            <IconExternalLink
              size={11}
              className='opacity-0 transition-opacity group-hover/link:opacity-60'
            />
          </a>
          {isActive ? (
            <span className='inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400'>
              <IconCircleCheck size={9} />
              Active
            </span>
          ) : (
            <span className='inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2 py-0.5 text-[10px] font-medium text-zinc-400'>
              <IconPlayerPause size={9} />
              Paused
            </span>
          )}
        </div>

        <div className='ml-4.75 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground'>
          <span>Since {installedDate}</span>
          <span>·</span>
          <span>
            Min severity: <span className='capitalize text-foreground/70'>{repo.severityThreshold}</span>
          </span>
          <span>·</span>
          {orderedAgents.length > 0 ? (
            <div className='flex items-center gap-1'>
              {orderedAgents.map((agent) => (
                <AgentBadge
                  key={agent}
                  agent={agent}
                  showLabel={false}
                />
              ))}
            </div>
          ) : (
            <span className='italic text-muted-foreground/60'>No agents enabled</span>
          )}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-3'>
        <Switch
          checked={isActive}
          onCheckedChange={handleToggleActive}
          disabled={isToggling}
        />
        <ConfigureSheet repo={repo} />
      </div>
    </div>
  );
}

function AvailableRepoRow({ repo, addingId, onAdd }: { repo: GithubRepo; addingId: number | null; onAdd: (repo: GithubRepo) => void }) {
  const [, repoName] = repo.fullName.split('/');

  return (
    <div className='flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/20 first:rounded-t-xl last:rounded-b-xl'>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-2'>
          <IconBrandGithub
            size={15}
            className='shrink-0 text-muted-foreground'
          />
          <a
            href={`https://github.com/${repo.fullName}`}
            target='_blank'
            rel='noopener noreferrer'
            className='group/link flex items-center gap-1 font-medium hover:text-primary'
          >
            {repoName}
            <IconExternalLink
              size={11}
              className='opacity-0 transition-opacity group-hover/link:opacity-60'
            />
          </a>
          {repo.private && (
            <IconLock
              size={11}
              className='shrink-0 text-muted-foreground'
            />
          )}
        </div>
        {repo.description && <p className='ml-4.75 mt-1 truncate text-xs text-muted-foreground'>{repo.description}</p>}
      </div>

      <Button
        size='sm'
        variant='outline'
        className='shrink-0 gap-1.5'
        disabled={addingId !== null}
        onClick={() => onAdd(repo)}
      >
        {addingId === repo.id ? (
          <IconLoader2
            size={13}
            className='animate-spin'
          />
        ) : (
          <>
            <IconPlus size={13} />
            Add
          </>
        )}
      </Button>
    </div>
  );
}

function NoReposState() {
  return (
    <div className='flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-20 text-center'>
      <div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
        <IconBrandGithub
          size={22}
          className='text-muted-foreground'
        />
      </div>
      <div className='space-y-1'>
        <p className='font-medium'>No repositories accessible</p>
        <p className='text-sm text-muted-foreground'>No GitHub repositories are accessible. Check your GitHub App installation.</p>
      </div>
    </div>
  );
}

function SearchEmptyState({ query, repositorySelection, installationId }: { query: string; repositorySelection: 'all' | 'selected'; installationId?: number }) {
  const router = useRouter();

  const configureUrl = installationId ? `https://github.com/settings/installations/${installationId}` : 'https://github.com/settings/installations';

  function handleConfigure() {
    openGithubPopup(configureUrl, () => router.refresh());
  }

  if (repositorySelection === 'all') {
    return (
      <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center'>
        <div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
          <IconSearch
            size={22}
            className='text-muted-foreground'
          />
        </div>
        <div className='space-y-1'>
          <p className='font-medium'>No results found</p>
          <p className='text-sm text-muted-foreground'>No repositories match &ldquo;{query}&rdquo;.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-4 rounded-xl border border-dashed border-border py-20 text-center'>
      <div className='flex size-12 items-center justify-center rounded-xl bg-muted'>
        <IconSearch
          size={22}
          className='text-muted-foreground'
        />
      </div>
      <div className='space-y-1'>
        <p className='font-medium'>No results found</p>
        <p className='text-sm text-muted-foreground'>No repositories match &ldquo;{query}&rdquo;. You may need to grant access to more repositories.</p>
      </div>
      <Button
        size='sm'
        variant='outline'
        className='gap-2'
        onClick={handleConfigure}
      >
        <IconSettings size={14} />
        Configure GitHub
      </Button>
    </div>
  );
}
