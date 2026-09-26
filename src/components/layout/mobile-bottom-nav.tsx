'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BriefcaseBusiness,
  House,
  MessageCircleMore,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const ITEMS = [
  { href: '/dashboard', key: 'today', icon: House },
  { href: '/inbox', key: 'conversations', icon: MessageCircleMore },
  { href: '/contacts', key: 'clients', icon: Users },
  { href: '/pipelines', key: 'deals', icon: BriefcaseBusiness },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslations('MobileNav');
  return (
    <nav
      aria-label={t('label')}
      className="border-border/70 bg-card/95 fixed inset-x-0 bottom-0 z-30 border-t px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-12px_35px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:hidden"
    >
      <ul className="grid grid-cols-4">
        {ITEMS.map(({ href, key, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('size-5', active && 'fill-primary/10')} />
                {t(key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
