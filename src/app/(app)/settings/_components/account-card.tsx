import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SignOutButton } from "@/components/sign-out-button";

export function AccountCard({ user, repoCount }: AccountCardProps) {
  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Account</CardTitle>
        <CardDescription>Your GitHub identity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Connected account</span>
            <span className="font-mono">GitHub</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Repositories</span>
            <span className="font-mono">{repoCount}</span>
          </div>
        </div>

        <Separator />

        <SignOutButton />
      </CardContent>
    </Card>
  );
}
