'use client';

import {
  IconBrain,
  IconBrandGoogle,
  IconBrandOpenai,
  IconKey,
  IconTrash,
} from '@tabler/icons-react';
import { useState, useTransition } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { deleteApiKey, saveApiKey } from '@/lib/actions';

interface ProviderConfig {
  label: string;
  Icon: React.ElementType;
  placeholder: string;
}

type KeyedProvider = Exclude<ReviewProvider, 'ollama'>;
const PROVIDERS: Record<KeyedProvider, ProviderConfig> = {
  google: {
    label: 'Google Gemini',
    Icon: IconBrandGoogle,
    placeholder: 'AIza...',
  },
  anthropic: {
    label: 'Anthropic Claude',
    Icon: IconBrain,
    placeholder: 'sk-ant-...',
  },
  openai: {
    label: 'OpenAI',
    Icon: IconBrandOpenai,
    placeholder: 'sk-...',
  },
};

interface ApiKeyRowProps {
  provider: ReviewProvider;
  config: ProviderConfig;
  configured: boolean;
}

function ApiKeyRow({ provider, config, configured }: ApiKeyRowProps) {
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isConfigured, setIsConfigured] = useState(configured);

  function handleSave() {
    if (!value.trim()) return;
    startTransition(async () => {
      const result = await saveApiKey(provider, value.trim());
      if (result.success) {
        setValue('');
        setIsConfigured(true);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await deleteApiKey(provider);
      if (result.success) {
        setIsConfigured(false);
      }
    });
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <config.Icon size={14} className='text-muted-foreground shrink-0' />
        <Label className='text-sm font-medium'>{config.label}</Label>
        {isConfigured && (
          <span className='ml-auto text-xs text-emerald-500'>Configured</span>
        )}
      </div>
      {isConfigured ? (
        <div className='flex items-center gap-2'>
          <Input
            value='••••••••••••••••••••••••••••••••'
            readOnly
            className='font-mono text-xs'
          />
          <Button
            variant='ghost'
            size='icon'
            disabled={isPending}
            onClick={handleRemove}
            className='shrink-0 text-destructive hover:text-destructive'
          >
            <IconTrash size={14} />
          </Button>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <Input
            placeholder={config.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className='font-mono text-xs'
            type='password'
            autoComplete='off'
          />
          <Button
            size='sm'
            disabled={isPending || !value.trim()}
            onClick={handleSave}
            className='shrink-0'
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

export function ApiKeysCard({
  configuredProviders,
}: {
  configuredProviders: ApiProvider[];
}) {
  const entries = Object.entries(PROVIDERS) as [
    KeyedProvider,
    ProviderConfig,
  ][];
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          <IconKey size={14} />
          API Keys
        </CardTitle>
        <CardDescription>
          Provide your own API keys. When set, reviews use your key instead of
          the shared system key.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {entries.map(([provider, config], i) => (
          <div key={provider}>
            {i > 0 && <Separator className='mb-4' />}
            <ApiKeyRow
              provider={provider}
              config={config}
              configured={configuredProviders.includes(provider as ApiProvider)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
