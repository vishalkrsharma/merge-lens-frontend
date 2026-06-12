'use client';

import {
  IconBrain,
  IconBrandGoogle,
  IconBrandOpenai,
  IconCheck,
  IconCpu,
} from '@tabler/icons-react';
import { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { setPreferredProvider } from '@/lib/actions';

interface ProviderMeta {
  label: string;
  model: string;
  Icon: React.ElementType;
  description: string;
}

const PROVIDER_META: Record<ReviewProvider, ProviderMeta> = {
  google: {
    label: 'Google Gemini',
    model: 'gemini-2.0-flash',
    Icon: IconBrandGoogle,
    description: 'Default — uses shared system key if no personal key is set.',
  },
  anthropic: {
    label: 'Anthropic Claude',
    model: 'claude-haiku-4-5',
    Icon: IconBrain,
    description: 'Requires your Anthropic API key.',
  },
  openai: {
    label: 'OpenAI',
    model: 'gpt-4o-mini',
    Icon: IconBrandOpenai,
    description: 'Requires your OpenAI API key.',
  },
};

const REVIEW_PROVIDERS: ReviewProvider[] = ['google', 'anthropic', 'openai'];

export function ProviderCard({
  configuredProviders,
  current,
}: {
  configuredProviders: ApiProvider[];
  current: ReviewProvider | null;
}) {
  const [isPending, startTransition] = useTransition();
  const active = current ?? 'google';

  function handleChange(value: string) {
    const provider = value as ReviewProvider;
    startTransition(async () => {
      await setPreferredProvider(provider === 'google' ? null : provider);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          <IconCpu size={14} />
          Review AI Provider
        </CardTitle>
        <CardDescription>
          Choose the AI model used to analyse pull requests. Non-Google
          providers require a personal API key.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={active}
          onValueChange={handleChange}
          className='gap-0'
          aria-disabled={isPending}
        >
          {REVIEW_PROVIDERS.map((provider) => {
            const meta = PROVIDER_META[provider];
            const needsKey = provider !== 'google';
            const hasKey = configuredProviders.includes(
              provider as ApiProvider,
            );
            const disabled = needsKey && !hasKey;

            return (
              <button
                key={provider}
                type='button'
                disabled={disabled}
                className={[
                  '-mt-px flex w-full cursor-pointer items-center gap-3 border p-3 text-left transition-colors first:mt-0',
                  disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'hover:bg-muted/40',
                  active === provider
                    ? 'border-primary bg-primary/5'
                    : 'border-border',
                ].join(' ')}
                onClick={() => handleChange(provider)}
              >
                <RadioGroupItem
                  value={provider}
                  disabled={disabled}
                  className='shrink-0'
                />
                <meta.Icon
                  size={16}
                  className='shrink-0 text-muted-foreground'
                />
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium leading-none'>
                      {meta.label}
                    </span>
                    <span className='bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
                      {meta.model}
                    </span>
                    {active === provider && (
                      <span className='ml-auto flex items-center gap-1 text-xs text-primary'>
                        <IconCheck size={11} />
                        Active
                      </span>
                    )}
                    {needsKey && !hasKey && (
                      <span className='ml-auto bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground'>
                        API key required
                      </span>
                    )}
                  </div>
                  <p className='mt-0.5 text-xs text-muted-foreground'>
                    {meta.description}
                  </p>
                </div>
              </button>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
