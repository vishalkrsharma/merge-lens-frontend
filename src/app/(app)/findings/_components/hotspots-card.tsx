import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HotspotFile {
  file: string;
  count: number;
}

export function HotspotsCard({ hotspots }: { hotspots: HotspotFile[] }) {
  const maxCount = hotspots[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-sm font-medium'>Hotspot files</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {hotspots.map(({ file, count }) => (
          <div key={file}>
            <div className='mb-1 flex items-center justify-between gap-2'>
              <span className='truncate font-mono text-xs text-muted-foreground'>
                {file.split('/').slice(-1)[0]}
              </span>
              <span className='font-mono text-xs font-medium'>{count}</span>
            </div>
            <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className='h-full rounded-full bg-primary'
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <p className='mt-0.5 truncate font-mono text-[10px] text-muted-foreground/60'>
              {file}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
