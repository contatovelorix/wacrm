'use client';

import Link from 'next/link';
import {
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  MessageCircleMore,
  Package,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslations } from 'next-intl';

interface Action {
  labelKey: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  tone: string;
}

const ACTIONS: Action[] = [
  {
    labelKey: 'conversations',
    href: '/inbox',
    icon: MessageCircleMore,
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    labelKey: 'clients',
    href: '/contacts',
    icon: Users,
    tone: 'bg-sky-50 text-sky-700',
  },
  {
    labelKey: 'deals',
    href: '/pipelines',
    icon: BriefcaseBusiness,
    tone: 'bg-violet-50 text-violet-700',
  },
  {
    labelKey: 'agenda',
    icon: CalendarDays,
    tone: 'bg-amber-50 text-amber-700',
  },
  { labelKey: 'catalog', icon: Package, tone: 'bg-rose-50 text-rose-700' },
  {
    labelKey: 'automations',
    href: '/automations',
    icon: Bot,
    tone: 'bg-teal-50 text-teal-700',
  },
];

export function QuickActions() {
  const t = useTranslations('Dashboard.quickActions');

  return (
    <section aria-labelledby="quick-actions-title">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
            {t('eyebrow')}
          </p>
          <h2
            id="quick-actions-title"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            {t('title')}
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6 sm:gap-3">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const content = (
            <>
              <span
                className={`flex size-11 items-center justify-center rounded-2xl ${action.tone}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-foreground text-center text-xs font-semibold sm:text-sm">
                {t(action.labelKey)}
              </span>
              {!action.href && (
                <span className="text-muted-foreground text-[10px] font-medium">
                  {t('soon')}
                </span>
              )}
            </>
          );
          return action.href ? (
            <Link
              key={action.labelKey}
              href={action.href}
              className="group border-border/70 bg-card hover:border-primary/30 flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {content}
            </Link>
          ) : (
            <div
              key={action.labelKey}
              aria-disabled="true"
              className="border-border bg-card/60 flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-3 opacity-75"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
