import { getApiKeys, getPreferredProvider } from '@/lib/api';
import { ApiKeysCard } from '../_components/api-keys-card';
import { ProviderCard } from '../_components/provider-card';

export default async function ModelsPage() {
  const [configuredProviders, preferredProvider] = await Promise.all([
    getApiKeys(),
    getPreferredProvider(),
  ]);
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      <ApiKeysCard configuredProviders={configuredProviders} />
      <ProviderCard
        configuredProviders={configuredProviders}
        current={preferredProvider}
      />
    </div>
  );
}
