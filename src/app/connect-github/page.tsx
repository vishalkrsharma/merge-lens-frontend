import {
  IconBrandGithub,
  IconGitPullRequest,
  IconShieldCheck,
  IconZoomCode,
} from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";

export default async function ConnectGitHubPage() {
  const session = await getSession();
  if (!session) redirect("/");

  if (session.user.hasGithubApp) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
      {/* <GithubAppPoller /> */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <IconBrandGithub className="size-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Connect MergeLens to GitHub
        </h1>
        <p className="max-w-md text-muted-foreground">
          Install the MergeLens GitHub App to start receiving automated
          AI-powered code reviews on your pull requests.
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <IconZoomCode className="size-5 text-primary" />
          <h3 className="font-semibold">Multi-agent reviews</h3>
          <p className="text-sm text-muted-foreground">
            Dedicated agents scan for bugs, security issues, performance
            problems, and style violations in every PR.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <IconShieldCheck className="size-5 text-primary" />
          <h3 className="font-semibold">Security-first</h3>
          <p className="text-sm text-muted-foreground">
            Catch OWASP top-10 vulnerabilities and secrets before they reach
            production.
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <IconGitPullRequest className="size-5 text-primary" />
          <h3 className="font-semibold">Inline comments</h3>
          <p className="text-sm text-muted-foreground">
            Findings are posted as inline PR comments so your team can act on
            them immediately.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href={process.env.GITHUB_APP_URL ?? "#"} />}
        >
          <IconBrandGithub size={18} />
          Install MergeLens on GitHub
        </Button>
        <p className="text-xs text-muted-foreground">
          You&apos;ll be redirected to GitHub to authorise the app on your
          account or organisation.
        </p>
      </div>
    </div>
  );
}
