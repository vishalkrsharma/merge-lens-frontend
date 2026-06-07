'use client';

import { IconSettings } from '@tabler/icons-react';
import { useState } from 'react';
import { AgentBadge } from '@/components/agent-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { updateRepository } from '@/lib/actions';

const ALL_AGENTS: AgentType[] = ['bug', 'security', 'performance', 'style'];

export function ConfigureSheet({ repo }: { repo: Repository }) {
  const [enabledAgents, setEnabledAgents] = useState<Set<AgentType>>(
    new Set(repo.enabledAgents),
  );
  const [threshold, setThreshold] = useState<Severity>(repo.severityThreshold);
  const [savedBase, setSavedBase] = useState({
    agents: new Set(repo.enabledAgents),
    threshold: repo.severityThreshold as Severity,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isDirty =
    threshold !== savedBase.threshold ||
    enabledAgents.size !== savedBase.agents.size ||
    [...enabledAgents].some((a) => !savedBase.agents.has(a));

  function toggleAgent(agent: AgentType) {
    setSaved(false);
    setEnabledAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agent)) next.delete(agent);
      else next.add(agent);
      return next;
    });
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateRepository(repo.id, {
        enabledAgents: [...enabledAgents],
        severityThreshold: threshold,
      });
      setSavedBase({ agents: new Set(enabledAgents), threshold });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size='sm' variant='ghost' className='shrink-0 gap-1.5' />
        }
      >
        <IconSettings size={14} />
        <span className='hidden sm:inline'>Configure</span>
      </SheetTrigger>

      <SheetContent className='flex flex-col'>
        <SheetHeader className='border-b border-border pb-4'>
          <SheetTitle className='font-mono'>
            {repo.owner}/{repo.repo}
          </SheetTitle>
          <SheetDescription>
            Configure review agents and severity threshold
          </SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-auto p-4'>
          <div>
            <p className='mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Enabled agents
            </p>
            <div className='space-y-3'>
              {ALL_AGENTS.map((agent) => (
                <div key={agent} className='flex items-center justify-between'>
                  <AgentBadge agent={agent} />
                  <Switch
                    checked={enabledAgents.has(agent)}
                    onCheckedChange={() => toggleAgent(agent)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className='mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Minimum severity
            </p>
            <Select
              value={threshold}
              onValueChange={(v) => {
                setSaved(false);
                setThreshold(v as Severity);
              }}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='low'>Low — report all findings</SelectItem>
                <SelectItem value='medium'>
                  Medium — skip low severity
                </SelectItem>
                <SelectItem value='high'>
                  High — critical issues only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className='border-t border-border'>
          <div className='flex w-full items-center justify-between gap-3'>
            {saved && !isDirty ? (
              <span className='text-xs text-green-400'>Changes saved</span>
            ) : (
              <span />
            )}
            <div className='flex gap-2'>
              <SheetClose render={<Button variant='outline' size='sm' />}>
                Cancel
              </SheetClose>
              <Button
                size='sm'
                onClick={handleSave}
                disabled={!isDirty || isSaving}
              >
                {isSaving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
