'use client';

import { IconChartBar, IconCpu, IconUser } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/settings/account', label: 'Account', Icon: IconUser },
  { href: '/settings/usage', label: 'Usage', Icon: IconChartBar },
  { href: '/settings/models', label: 'AI Models', Icon: IconCpu },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className='flex gap-1 border-b'>
      {tabs.map(({ href, label, Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex items-center gap-1.5 px-2 pb-2 text-sm transition-colors',
              isActive
                ? 'border-b-2 border-primary font-medium text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
