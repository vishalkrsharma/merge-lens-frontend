import { PageHeader } from "@/components/page-header";
import { RepoCard } from "@/components/repo-card";
import { MOCK_REPOSITORIES } from "@/data/mock";

export default function RepositoriesPage() {
  return (
    <>
      <PageHeader
        title="Repositories"
        description="Configure MergeLens for each installed repository"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_REPOSITORIES.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </>
  );
}
