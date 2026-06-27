'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconBrandGithub, IconLoader2 } from '@tabler/icons-react';

export function InstallationPoller() {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      router.refresh();
      if (attempts >= 15) clearInterval(interval);
    }, 2000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 text-center'>
      <div className='relative mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20'>
        <IconBrandGithub className='size-7 text-primary' />
        <IconLoader2 className='absolute -right-1 -top-1 size-4 animate-spin text-primary' />
      </div>
      <h2 className='text-xl font-semibold'>Connecting your GitHub App…</h2>
      <p className='max-w-sm text-sm text-muted-foreground'>
        Waiting for GitHub to confirm the installation. This usually takes a few seconds.
      </p>
    </div>
  );
}
