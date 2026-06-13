import { PageHeader } from '@/components/page-header';
import { SettingsNav } from './_components/settings-nav';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title='Settings'
        description='Manage your account, usage, and AI review configuration'
      />
      <SettingsNav />
      <div className='mt-6'>{children}</div>
    </>
  );
}
