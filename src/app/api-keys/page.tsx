import { IconKey } from '@tabler/icons-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiKeysCard } from '@/app/(app)/settings/_components/api-keys-card';
import { ProviderCard } from '@/app/(app)/settings/_components/provider-card';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/auth';
import { getApiKeys, getPreferredProvider } from '@/lib/api';
import { completeOnboarding } from './actions';
import { InstallationPoller } from './_components/installation-poller';

interface PageProps {
  searchParams: Promise<{ installation_id?: string; setup_action?: string }>;
}

export default async function ApiKeysPage({ searchParams }: PageProps) {
  const { installation_id } = await searchParams;
  const session = await getSession();
  if (!session) redirect('/');

  if (!session.user.hasGithubApp) {
    // GitHub just redirected here after install — wait for the webhook to process
    if (installation_id) return <InstallationPoller />;
    redirect('/connect-github');
  }

  const jar = await cookies();
  if (jar.get('ml_onboarding_done')?.value === '1') redirect('/dashboard');

  const [configuredProviders, preferredProvider] = await Promise.all([
    getApiKeys(),
    getPreferredProvider(),
  ]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-16'>
      <div className='flex flex-col items-center gap-3 text-center'>
        <div className='mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20'>
          <IconKey className='size-7 text-primary' />
        </div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Set up your AI provider
        </h1>
        <p className='max-w-md text-muted-foreground'>
          MergeLens uses AI to review your pull requests. Add your own API key
          to use your preferred provider and control your own billing.
        </p>
      </div>

      <div className='grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2'>
        <ApiKeysCard configuredProviders={configuredProviders} />
        <ProviderCard
          configuredProviders={configuredProviders}
          current={preferredProvider}
        />
      </div>

      <div className='flex flex-col items-center gap-3'>
        <form action={completeOnboarding}>
          <Button type='submit' size='lg'>
            Go to Dashboard →
          </Button>
        </form>
        <form action={completeOnboarding}>
          <button
            type='submit'
            className='text-sm text-muted-foreground transition-colors hover:text-foreground'
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
