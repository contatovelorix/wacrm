'use client';

import { ExternalLink, Globe2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function OnlineBusinessCard() {
  const t = useTranslations('Dashboard.onlineBusiness');
  return (
    <section
      className="border-border/70 relative overflow-hidden rounded-3xl border bg-slate-950 p-5 text-white shadow-[0_20px_60px_-36px_rgba(15,23,42,0.8)] sm:p-7"
      aria-labelledby="online-business-title"
    >
      <div className="absolute -top-20 -right-16 size-52 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between gap-4">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-emerald-300">
            <Globe2 className="size-5" />
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-200 uppercase">
            {t('soon')}
          </span>
        </div>
        <div>
          <h2
            id="online-business-title"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {t('title')}
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
            {t('description')}
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-400"
            aria-disabled="true"
          >
            {t('preview')} <ExternalLink className="size-3.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
