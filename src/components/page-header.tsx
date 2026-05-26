import { Separator } from '@/components/ui/separator';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className='mb-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold'>{title}</h1>
          {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <Separator className='mt-4' />
    </div>
  );
}
