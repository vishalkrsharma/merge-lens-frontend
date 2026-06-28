'use client';

import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  preferredProvider: string | null;
  ollamaUrl: string | null;
}

type OllamaStep =
  | { step: 'url' }
  | { step: 'loading' }
  | { step: 'models'; list: string[] }
  | { step: 'error'; message: string };

export function ModelCard({
  models,
  configuredProviders,
  currentModelId,
  preferredProvider,
  ollamaUrl,
}: ModelCardProps) {
  const [isPending, startTransition] = useTransition();
  const [urlPending, startUrlTransition] = useTransition();

  const [isOllamaMode, setIsOllamaMode] = useState(preferredProvider === 'ollama');
  const [localUrl, setLocalUrl] = useState(ollamaUrl ?? '');
  const [ollamaStep, setOllamaStep] = useState<OllamaStep>({ step: 'url' });
  const [selectedOllamaModel, setSelectedOllamaModel] = useState<string | null>(
    preferredProvider === 'ollama' ? currentModelId : null,
  );
  const [ollamaPickerOpen, setOllamaPickerOpen] = useState(false);

  // Auto-fetch Ollama models on mount if Ollama is already selected
  useEffect(() => {
    if (preferredProvider === 'ollama') {
      fetchOllamaModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchOllamaModels() {
    setOllamaStep({ step: 'loading' });
    getOllamaModels(localUrl || undefined).then((result) => {
      if (result.error) {
        setOllamaStep({ step: 'error', message: result.error });
      } else {
        setOllamaStep({ step: 'models', list: result.models });
      }
    });
  }

  function handleMainSelect(value: string) {
    if (value === 'ollama') {
      setIsOllamaMode(true);
      setOllamaStep({ step: 'url' });
      return;
    }
    setIsOllamaMode(false);
    setSelectedOllamaModel(null);
    setOllamaStep({ step: 'url' });
    startTransition(async () => {
      await setPreferredModel(value);
    });
  }

  function handleOllamaModelSelect(modelId: string) {
    setSelectedOllamaModel(modelId);
    setOllamaPickerOpen(false);
    startTransition(async () => {
      await setPreferredModelWithProvider(modelId, 'ollama');
    });
  }

  function handleUrlBlur() {
    const trimmed = localUrl.trim();
    if (trimmed === (ollamaUrl ?? '')) return;
    startUrlTransition(async () => {
      await setOllamaUrl(trimmed || null);
    });
  }

  const comboboxValue = isOllamaMode ? 'ollama' : currentModelId;
  const selectedCloudModel = isOllamaMode ? null : models.find((m) => m.id === currentModelId);

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
          value={comboboxValue}
          configuredProviders={configuredProviders}
          onSelect={handleMainSelect}
          disabled={isPending}
        />

        {selectedCloudModel && (
          <p className='text-xs text-muted-foreground'>
            {selectedCloudModel.description}
          </p>
        )}

        {isOllamaMode && (
          <div className='space-y-3 border-t pt-3'>
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
                  disabled={ollamaStep.step === 'loading'}
                  title='Connect to Ollama server'
                >
                  {ollamaStep.step === 'loading' ? (
                    <IconLoader2 size={14} className='animate-spin' />
                  ) : (
                    <IconRefresh size={14} />
                  )}
                </Button>
              </div>
            </div>

            {ollamaStep.step === 'url' && (
              <p className='text-[11px] text-muted-foreground'>
                Enter your Ollama server URL and click{' '}
                <button
                  type='button'
                  className='underline'
                  onClick={fetchOllamaModels}
                >
                  connect
                </button>{' '}
                to see available models.
              </p>
            )}

            {ollamaStep.step === 'error' && (
              <p className='flex items-center gap-1 text-[11px] text-destructive'>
                <IconAlertCircle size={12} />
                {ollamaStep.message}
              </p>
            )}

            {ollamaStep.step === 'models' && (
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <Label className='text-xs text-muted-foreground'>Model</Label>
                  <span className='flex items-center gap-1 text-[11px] text-emerald-500'>
                    <IconCheck size={11} />
                    {ollamaStep.list.length} model
                    {ollamaStep.list.length !== 1 ? 's' : ''} available
                  </span>
                </div>

                <Popover open={ollamaPickerOpen} onOpenChange={setOllamaPickerOpen}>
                  <PopoverTrigger
                    disabled={isPending}
                    className='flex w-full items-center justify-between border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <span
                      className={
                        selectedOllamaModel
                          ? 'font-mono text-xs text-foreground'
                          : 'text-muted-foreground'
                      }
                    >
                      {selectedOllamaModel ?? 'Select a model...'}
                    </span>
                    <IconChevronDown
                      size={14}
                      className='shrink-0 text-muted-foreground'
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    align='start'
                    className='w-[--radix-popover-trigger-width] min-w-64 p-0'
                  >
                    <Command>
                      <CommandInput placeholder='Search models...' />
                      <CommandList>
                        <CommandEmpty>No models found.</CommandEmpty>
                        <CommandGroup>
                          {ollamaStep.list.map((name) => (
                            <CommandItem
                              key={name}
                              value={name}
                              onSelect={() => handleOllamaModelSelect(name)}
                              data-checked={
                                name === selectedOllamaModel ? 'true' : undefined
                              }
                            >
                              <span className='font-mono text-xs'>{name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
