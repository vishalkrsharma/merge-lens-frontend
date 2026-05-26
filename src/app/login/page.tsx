import Link from "next/link";
import { IconBrandGithub, IconGitBranch } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2">
        <IconGitBranch size={24} className="text-primary" />
        <span className="font-mono text-xl font-semibold">MergeLens</span>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Sign in</CardTitle>
          <CardDescription>Connect your GitHub account to view your PR reviews.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/dashboard"
            className={cn(buttonVariants(), "w-full gap-2 justify-center")}
          >
            <IconBrandGithub size={16} />
            Continue with GitHub
          </Link>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in you authorize MergeLens to read your pull requests and post review comments.
          </p>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground">
        <Link href="/" className="underline-offset-4 hover:underline">Back to home</Link>
      </p>
    </div>
  );
}
