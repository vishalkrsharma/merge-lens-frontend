import {
  IconBolt,
  IconBug,
  IconLock,
  IconSparkles,
  IconTextScanAi,
} from "@tabler/icons-react";
import { GitHubSignInButton } from "@/app/_components/github-sign-in-button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: IconBug,
    color: "text-red-400",
    title: "Bug Detection",
    description:
      "Catches logic errors, null pointer dereferences, type mismatches, and off-by-one mistakes before they reach production.",
  },
  {
    icon: IconLock,
    color: "text-orange-400",
    title: "Security Analysis",
    description:
      "Identifies injection vulnerabilities, authentication flaws, exposed secrets, and insecure dependencies.",
  },
  {
    icon: IconBolt,
    color: "text-yellow-400",
    title: "Performance Review",
    description:
      "Spots N+1 queries, blocking I/O, unnecessary re-renders, and memory leaks in your diff.",
  },
  {
    icon: IconSparkles,
    color: "text-purple-400",
    title: "Style & Quality",
    description:
      "Enforces naming conventions, highlights overly complex functions, and suggests structural improvements.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <IconTextScanAi stroke={2} size={24} className="text-primary" />
            <span className="font-mono font-semibold">MergeLens</span>
          </div>
          <div className="flex items-center gap-3">
            <GitHubSignInButton size="sm" iconSize={14}>
              Get started
            </GitHubSignInButton>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-24 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Multi-agent AI review pipeline
          </div>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight leading-tight">
            AI-powered PR reviews,
            <br />
            <span className="text-primary">automated.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed">
            MergeLens runs four specialized AI agents on every pull request —
            catching bugs, security issues, performance problems, and style
            violations before your team reviews the code.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <GitHubSignInButton />
            {/* <GitHubSignInButton variant='outline'>View dashboard</GitHubSignInButton> */}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-24">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="bg-card/60">
                <CardHeader>
                  <f.icon size={22} className={f.color} />
                  <CardTitle className="mt-2 text-sm">{f.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        MergeLens — built with Claude + Gemini
      </footer>
    </div>
  );
}
