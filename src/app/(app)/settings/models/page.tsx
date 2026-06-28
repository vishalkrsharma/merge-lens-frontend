import { getApiKeys, getModels, getPreferredModel } from '@/lib/api';
import { ApiKeysCard } from '../_components/api-keys-card';
import { ModelCard } from '../_components/model-card';

export default async function ModelsPage() {
  const [configuredProviders, models, currentModelId] = await Promise.all([
    getApiKeys(),
    getModels(),
    getPreferredModel(),
  ]);
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <ApiKeysCard configuredProviders={configuredProviders} />
      <ModelCard
        models={models}
        configuredProviders={configuredProviders}
        currentModelId={currentModelId}
      />
    </div>
  );
}
