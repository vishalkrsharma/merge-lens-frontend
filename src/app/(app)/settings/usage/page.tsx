import { getUsage } from '@/lib/api';
import { UsageCard } from '../_components/usage-card';

export default async function UsagePage() {
  const usage = await getUsage();
  return <UsageCard usage={usage} />;
}
