import { PageHeader } from '@/components/page-header';
import {
  listAvailableRepositories,
  listRepositories,
  syncRepositories,
} from '@/lib/api';
import { ReposList } from './_components/repos-list';

export default async function RepositoriesPage() {
  const [repos, sync, available] = await Promise.all([
    listRepositories(),
    syncRepositories().catch(() => null),
    listAvailableRepositories().catch(() => []),
  ]);

  const removedSet = new Set(sync?.removed ?? []);
  const connectedRepos =
    removedSet.size > 0
      ? repos.filter((r) => !removedSet.has(`${r.owner}/${r.repo}`))
      : repos;

  const repositorySelection = sync?.repositorySelection ?? 'selected';
  const installationId = connectedRepos[0]?.installationId;

  return (
    <>
      <PageHeader
        title='GitHub Repositories'
        description='Manage and configure repositories connected to MergeLens'
      />
      <ReposList
        connectedRepos={connectedRepos}
        availableRepos={available}
        repositorySelection={repositorySelection}
        installationId={installationId}
      />
    </>
  );
}
