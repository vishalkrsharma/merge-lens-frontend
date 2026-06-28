import {
  getApiKeys,
  getModels,
  getOllamaUrl,
  getPreferredModel,
} from '@/lib/api';
import { ApiKeysCard } from '../_components/api-keys-card';
import { ModelCard } from '../_components/model-card';

export default async function ModelsPage() {
  const [configuredProviders, models, { model: currentModelId, provider: preferredProvider }, ollamaUrl] =
    await Promise.all([
      getApiKeys(),
      getModels(),
      getPreferredModel(),
      getOllamaUrl(),
    ]);
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <ApiKeysCard configuredProviders={configuredProviders} />
      <ModelCard
        models={models}
        configuredProviders={configuredProviders}
        currentModelId={currentModelId}
        preferredProvider={preferredProvider}
        ollamaUrl={ollamaUrl}
      />
    </div>
  );
}
