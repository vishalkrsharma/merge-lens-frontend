'use client';

import {
  IconBrain,
  IconBrandGoogle,
  IconBrandOpenai,
  IconChevronDown,
  IconCpu,
  IconLock,
} from '@tabler/icons-react';
import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const PROVIDER_ICONS: Record<string, React.ElementType> = {
  google: IconBrandGoogle,
  anthropic: IconBrain,
  openai: IconBrandOpenai,
};

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  anthropic: 'Anthropic',
  openai: 'OpenAI',
};

const CLOUD_PROVIDERS = ['google', 'anthropic', 'openai'];

interface ModelComboboxProps {
  models: ModelEntry[];
  value: string | null;
  configuredProviders: ApiProvider[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function ModelCombobox({
  models,
  value,
  configuredProviders,
  onSelect,
  disabled,
}: ModelComboboxProps) {
  const [open, setOpen] = useState(false);

  const isOllama = value === 'ollama';
  const selected = isOllama ? null : models.find((m) => m.id === value);

  function handleSelect(id: string) {
    onSelect(id);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(o) => setOpen(o)}>
      <PopoverTrigger
        disabled={disabled}
        className='flex w-full items-center justify-between border bg-background px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-50'
      >
        <span className='flex items-center gap-2'>
          {isOllama ? (
            <>
              <IconCpu size={14} className='shrink-0 text-muted-foreground' />
              <span className='text-foreground'>Ollama</span>
            </>
          ) : selected ? (
            <>
              {(() => {
                const Icon =
                  PROVIDER_ICONS[selected.provider] ?? IconBrandGoogle;
                return (
                  <Icon size={14} className='shrink-0 text-muted-foreground' />
                );
              })()}
              <span className='text-foreground'>{selected.name}</span>
              <span className='bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                {PROVIDER_LABELS[selected.provider]}
              </span>
            </>
          ) : (
            <span className='text-muted-foreground'>Select a model...</span>
          )}
        </span>
        <IconChevronDown size={14} className='shrink-0 text-muted-foreground' />
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='w-[--radix-popover-trigger-width] min-w-80 p-0'
      >
        <Command>
          <CommandInput placeholder='Search models...' />
          <CommandList>
            <CommandEmpty>No models found.</CommandEmpty>
            {CLOUD_PROVIDERS.map((provider, i) => {
              const providerModels = models.filter(
                (m) => m.provider === provider,
              );
              if (providerModels.length === 0) return null;
              const Icon = PROVIDER_ICONS[provider] ?? IconBrandGoogle;
              const hasKey = configuredProviders.includes(
                provider as ApiProvider,
              );

              return (
                <span key={provider}>
                  {i > 0 && <CommandSeparator />}
                  <CommandGroup heading={PROVIDER_LABELS[provider]}>
                    {providerModels.map((model) => (
                      <CommandItem
                        key={model.id}
                        value={`${model.name} ${model.id}`}
                        onSelect={() => hasKey && handleSelect(model.id)}
                        data-checked={model.id === value ? 'true' : undefined}
                        disabled={!hasKey}
                        className={!hasKey ? 'opacity-50' : ''}
                      >
                        <Icon
                          size={14}
                          className='shrink-0 text-muted-foreground'
                        />
                        <span className='flex-1'>
                          <span className='block font-medium leading-none'>
                            {model.name}
                          </span>
                          <span className='mt-0.5 block text-[10px] text-muted-foreground'>
                            {model.description}
                          </span>
                        </span>
                        {!hasKey && (
                          <IconLock
                            size={12}
                            className='shrink-0 text-muted-foreground'
                          />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </span>
              );
            })}
            <CommandSeparator />
            <CommandGroup heading='Ollama'>
              <CommandItem
                value='ollama'
                onSelect={() => handleSelect('ollama')}
                data-checked={isOllama ? 'true' : undefined}
              >
                <IconCpu size={14} className='shrink-0 text-muted-foreground' />
                <span className='flex-1'>
                  <span className='block font-medium leading-none'>Ollama</span>
                  <span className='mt-0.5 block text-[10px] text-muted-foreground'>
                    Run models on your own hardware
                  </span>
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
