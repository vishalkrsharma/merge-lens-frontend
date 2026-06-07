import {
  IconArrowLeft,
  IconGitPullRequest,
  IconTextScanAi,
} from "@tabler/icons-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center">
          <Link href="/" className="flex items-center gap-2">
            <IconTextScanAi stroke={2} size={24} className="text-primary" />
            <span className="font-mono font-semibold">MergeLens</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex items-center justify-center rounded-full border border-border bg-muted/50 p-6">
          <IconGitPullRequest size={48} className="text-muted-foreground" />
        </div>

        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
          This PR got closed or never existed. The page you're looking for has
          been merged, deleted, or moved to a different branch.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            <IconArrowLeft size={16} />
            Back to home
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
          >
            Go to dashboard
          </Link>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        MergeLens — built with Claude + Gemini
      </footer>
    </div>
  );
}
