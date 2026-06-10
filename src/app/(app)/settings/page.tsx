import { PageHeader } from '@/components/page-header';
import { getApiKeys, getUsage, listRepositories } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { AccountCard } from './_components/account-card';
import { ApiKeysCard } from './_components/api-keys-card';
import { UsageCard } from './_components/usage-card';

export default async function SettingsPage() {
  const [session, usage, repos, configuredProviders] = await Promise.all([
    getSession(),
    getUsage(),
    listRepositories(),
    getApiKeys(),
  ]);

  return (
    <>
      <PageHeader
        title='Settings'
        description='Usage tracking and account information'
      />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <UsageCard usage={usage} />
        <AccountCard user={session?.user} repoCount={repos.length} />
        <ApiKeysCard configuredProviders={configuredProviders} />
      </div>
    </>
  );
}
