import { listRepositories } from '@/lib/api';
import { getSession } from '@/lib/auth';
import { AccountCard } from '../_components/account-card';

export default async function AccountPage() {
  const [session, repos] = await Promise.all([
    getSession(),
    listRepositories(),
  ]);
  if (!session) return null;
  return <AccountCard user={session.user} repoCount={repos.length} />;
}
