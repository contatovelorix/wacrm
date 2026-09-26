'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  MessageCircleMore,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AttentionCardProps {
  openConversations: number;
  openDeals: number;
}

export function AttentionCard({
  openConversations,
  openDeals,
}: AttentionCardProps) {
  const t = useTranslations('Dashboard.attention');
  const hasAttention = openConversations > 0 || openDeals > 0;

  return (
    <section
      className="overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-[0_18px_50px_-32px_rgba(5,150,105,0.45)] sm:p-7"
      aria-labelledby="attention-title"
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
          {hasAttention ? (
            <Sparkles className="size-5" />
          ) : (
            <CheckCircle2 className="size-5" />
          )}
        </span>
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-emerald-700 uppercase">
            {t('eyebrow')}
          </p>
          <h2
            id="attention-title"
            className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
          >
            {t('title')}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {hasAttention ? t('description') : t('allClear')}
          </p>
        </div>
      </div>

      {hasAttention && (
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {openConversations > 0 && (
            <Link
              href="/inbox"
              className="group flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-3.5 shadow-sm transition hover:shadow-md"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MessageCircleMore className="size-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">
                {t('conversations', { count: openConversations })}
              </span>
              <ArrowRight className="size-4 text-emerald-700 transition group-hover:translate-x-0.5" />
            </Link>
          )}
          {openDeals > 0 && (
            <Link
              href="/pipelines"
              className="group flex items-center gap-3 rounded-2xl border border-white bg-white/90 p-3.5 shadow-sm transition hover:shadow-md"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <Sparkles className="size-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-slate-800">
                {t('deals', { count: openDeals })}
              </span>
              <ArrowRight className="size-4 text-violet-700 transition group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
