'use client';

import { IconCpu } from '@tabler/icons-react';
import { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { setPreferredModel } from '@/lib/actions';
import { ModelCombobox } from './model-combobox';

interface ModelCardProps {
  models: ModelEntry[];
  configuredProviders: ApiProvider[];
  currentModelId: string | null;
}

export function ModelCard({
  models,
  configuredProviders,
  currentModelId,
}: ModelCardProps) {
  const [isPending, startTransition] = useTransition();
  const selected = models.find((m) => m.id === currentModelId);

  function handleSelect(modelId: string) {
    startTransition(async () => {
      await setPreferredModel(modelId);
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
        {selected && (
          <p className='text-xs text-muted-foreground'>
            {selected.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
