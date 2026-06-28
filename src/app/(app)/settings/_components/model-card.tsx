'use client';

import { IconCpu } from '@tabler/icons-react';
import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setOllamaUrl, setPreferredModel } from '@/lib/actions';
import { ModelCombobox } from './model-combobox';

interface ModelCardProps {
  models: ModelEntry[];
  configuredProviders: ApiProvider[];
  currentModelId: string | null;
  ollamaUrl: string | null;
}

export function ModelCard({
  models,
  configuredProviders,
  currentModelId,
  ollamaUrl,
}: ModelCardProps) {
  const [isPending, startTransition] = useTransition();
  const [urlPending, startUrlTransition] = useTransition();
  const [localUrl, setLocalUrl] = useState(ollamaUrl ?? '');

  const selected = models.find((m) => m.id === currentModelId);
  const isOllamaSelected = selected?.provider === 'ollama';

  function handleSelect(modelId: string) {
    startTransition(async () => {
      await setPreferredModel(modelId);
    });
  }

  function handleUrlBlur() {
    const trimmed = localUrl.trim();
    if (trimmed === (ollamaUrl ?? '')) return;
    startUrlTransition(async () => {
      await setOllamaUrl(trimmed || null);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          <IconCpu size={14} />
          Review AI Model
        </CardTitle>
        <CardDescription>
          Choose the AI model used to analyse pull requests. Providers without a
          saved API key are locked.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <ModelCombobox
          models={models}
          currentModelId={currentModelId}
          configuredProviders={configuredProviders}
          onSelect={handleSelect}
          disabled={isPending}
        />
        {selected && !isOllamaSelected && (
          <p className='text-xs text-muted-foreground'>
            {selected.description}
          </p>
        )}
        {isOllamaSelected && (
          <div className='space-y-1.5'>
            <Label className='text-xs text-muted-foreground'>
              Ollama server URL
            </Label>
            <Input
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder='http://localhost:11434'
              className='font-mono text-xs'
              disabled={urlPending}
            />
            <p className='text-[10px] text-muted-foreground'>
              Leave blank to use the default ({' '}
              <span className='font-mono'>http://localhost:11434</span>). Point
              to any reachable Ollama instance for remote use.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
