'use client';

import {
  IconAlertCircle,
  IconCheck,
  IconCpu,
  IconLoader2,
  IconRefresh,
} from '@tabler/icons-react';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getOllamaModels,
  setOllamaUrl,
  setPreferredModel,
  setPreferredModelWithProvider,
} from '@/lib/actions';
import { ModelCombobox } from './model-combobox';

interface ModelCardProps {
  models: ModelEntry[];
  configuredProviders: ApiProvider[];
  currentModelId: string | null;
  ollamaUrl: string | null;
}

type OllamaStatus =
  | { state: 'idle' }
  | { state: 'loading' }
  | { state: 'ok'; models: string[] }
  | { state: 'error'; message: string };

export function ModelCard({
  models,
  configuredProviders,
  currentModelId,
  ollamaUrl,
}: ModelCardProps) {
  const [isPending, startTransition] = useTransition();
  const [urlPending, startUrlTransition] = useTransition();
  const [localUrl, setLocalUrl] = useState(ollamaUrl ?? '');
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({
    state: 'idle',
  });

  const catalogSelected = models.find((m) => m.id === currentModelId);
  const isOllamaSelected =
    catalogSelected?.provider === 'ollama' ||
    (ollamaStatus.state === 'ok' &&
      ollamaStatus.models.includes(currentModelId ?? ''));

  // Merge catalog non-ollama models with dynamically fetched ollama models
  const ollamaModels: ModelEntry[] =
    ollamaStatus.state === 'ok'
      ? ollamaStatus.models.map((name) => ({
          id: name,
          name,
          provider: 'ollama' as ReviewProvider,
          description: 'Available on your Ollama server',
        }))
      : models.filter((m) => m.provider === 'ollama');

  const mergedModels: ModelEntry[] = [
    ...models.filter((m) => m.provider !== 'ollama'),
    ...ollamaModels,
  ];

  function fetchOllamaModels() {
    setOllamaStatus({ state: 'loading' });
    getOllamaModels().then((result) => {
      if (result.error) {
        setOllamaStatus({ state: 'error', message: result.error });
      } else {
        setOllamaStatus({ state: 'ok', models: result.models });
      }
    });
  }

  // Auto-fetch when an Ollama model might be selected on mount
  useEffect(() => {
    if (isOllamaSelected || catalogSelected?.provider === 'ollama') {
      fetchOllamaModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(modelId: string) {
    const entry = mergedModels.find((m) => m.id === modelId);
    startTransition(async () => {
      if (entry && entry.provider === 'ollama') {
        await setPreferredModelWithProvider(modelId, 'ollama');
      } else {
        await setPreferredModel(modelId);
      }
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
          models={mergedModels}
          currentModelId={currentModelId}
          configuredProviders={configuredProviders}
          onSelect={handleSelect}
          disabled={isPending}
        />
        {catalogSelected && !isOllamaSelected && (
          <p className='text-xs text-muted-foreground'>
            {catalogSelected.description}
          </p>
        )}

        {/* Ollama server config — shown when Ollama section is relevant */}
        {(isOllamaSelected || ollamaStatus.state !== 'idle') && (
          <div className='space-y-2 border-t pt-3'>
            <div className='space-y-1.5'>
              <Label className='text-xs text-muted-foreground'>
                Ollama server URL
              </Label>
              <div className='flex gap-2'>
                <Input
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  onBlur={handleUrlBlur}
                  placeholder='http://localhost:11434'
                  className='font-mono text-xs'
                  disabled={urlPending}
                />
                <Button
                  variant='outline'
                  size='icon'
                  className='shrink-0'
                  onClick={fetchOllamaModels}
                  disabled={ollamaStatus.state === 'loading'}
                  title='Check connection'
                >
                  {ollamaStatus.state === 'loading' ? (
                    <IconLoader2 size={14} className='animate-spin' />
                  ) : (
                    <IconRefresh size={14} />
                  )}
                </Button>
              </div>
            </div>

            {ollamaStatus.state === 'ok' && (
              <p className='flex items-center gap-1 text-[11px] text-emerald-500'>
                <IconCheck size={12} />
                Connected &mdash; {ollamaStatus.models.length} model
                {ollamaStatus.models.length !== 1 ? 's' : ''} available
              </p>
            )}
            {ollamaStatus.state === 'error' && (
              <p className='flex items-center gap-1 text-[11px] text-destructive'>
                <IconAlertCircle size={12} />
                {ollamaStatus.message}
              </p>
            )}
            {ollamaStatus.state === 'idle' && (
              <p className='text-[10px] text-muted-foreground'>
                Click{' '}
                <button
                  type='button'
                  className='underline'
                  onClick={fetchOllamaModels}
                >
                  refresh
                </button>{' '}
                to load models from your server. Leave URL blank to use{' '}
                <span className='font-mono'>http://localhost:11434</span>.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
