import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/severity-badge";

const SEVERITIES: Severity[] = ["high", "medium", "low"];

export function SeverityCard({ counts }: { counts: Record<Severity, number> }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm font-medium">By severity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {SEVERITIES.map((s) => (
          <div key={s} className="flex items-center justify-between">
            <SeverityBadge severity={s} />
            <span className="font-mono text-sm">{counts[s]}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
