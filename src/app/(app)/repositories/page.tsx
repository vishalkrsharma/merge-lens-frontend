import { PageHeader } from "@/components/page-header";
import { RepoCard } from "@/components/repo-card";
import { listRepositories } from "@/lib/api";

export default async function RepositoriesPage() {
  const repos = await listRepositories();

  return (
    <>
      <PageHeader
        title="Repositories"
        description="Configure MergeLens for each installed repository"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </>
  );
}
