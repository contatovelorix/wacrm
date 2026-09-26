'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { formatCurrency } from '@/lib/currency';
import {
  MessageSquare,
  UserPlus,
  DollarSign,
  CalendarDays,
} from 'lucide-react';

import {
  loadActivity,
  loadConversationsSeries,
  loadMetrics,
  loadPipelineDonut,
  loadResponseTime,
} from '@/lib/dashboard/queries';
import type {
  ActivityItem,
  ConversationsSeriesPoint,
  MetricsBundle,
  PipelineDonutData,
  ResponseTimeSummary,
} from '@/lib/dashboard/types';

import { MetricCard } from '@/components/dashboard/metric-card';
import { SkeletonCard } from '@/components/dashboard/skeleton';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ConversationsChart } from '@/components/dashboard/conversations-chart';
import { PipelineDonut } from '@/components/dashboard/pipeline-donut';
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { AttentionCard } from '@/components/dashboard/attention-card';
import { OnlineBusinessCard } from '@/components/dashboard/online-business-card';

import { useTranslations } from 'next-intl';

type RangeDays = 7 | 30 | 90;

export default function DashboardPage() {
  const t = useTranslations('Dashboard.page');
  const { defaultCurrency, profile } = useAuth();
  const [metrics, setMetrics] = useState<MetricsBundle | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  const [range, setRange] = useState<RangeDays>(30);
  // Keep a cache per range so switching tabs doesn't re-fetch what we
  // already have. Ranges the user hasn't opened yet stay null and
  // trigger a fetch on first view.
  const [series, setSeries] = useState<
    Record<RangeDays, ConversationsSeriesPoint[] | null>
  >({
    7: null,
    30: null,
    90: null,
  });
  const [seriesLoading, setSeriesLoading] = useState(true);

  const [pipeline, setPipeline] = useState<PipelineDonutData | null>(null);
  const [pipelineLoading, setPipelineLoading] = useState(true);

  const [responseTime, setResponseTime] = useState<ResponseTimeSummary | null>(
    null
  );
  const [responseTimeLoading, setResponseTimeLoading] = useState(true);

  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [activityLoading, setActivityLoading] = useState(true);

  const loadAll = useCallback(() => {
    const db = createClient();

    // Kick everything off in parallel. Each block has its own
    // setState + finally so a slow query doesn't hold up faster
    // sections — each widget shows its own skeleton independently.
    void loadMetrics(db)
      .then((m) => setMetrics(m))
      .catch((err) => console.error('[dashboard] metrics failed:', err))
      .finally(() => setMetricsLoading(false));

    void loadConversationsSeries(db, 30)
      .then((s) => setSeries((prev) => ({ ...prev, 30: s })))
      .catch((err) => console.error('[dashboard] series failed:', err))
      .finally(() => setSeriesLoading(false));

    void loadPipelineDonut(db)
      .then((p) => setPipeline(p))
      .catch((err) => console.error('[dashboard] pipeline failed:', err))
      .finally(() => setPipelineLoading(false));

    void loadResponseTime(db)
      .then((r) => setResponseTime(r))
      .catch((err) => console.error('[dashboard] response time failed:', err))
      .finally(() => setResponseTimeLoading(false));

    // Fetch up to 50 so the biggest page-size option in the feed
    // (50 rows) is already in memory — switching sizes then becomes
    // a pure client-side slice with no extra round trip.
    void loadActivity(db, 50)
      .then((a) => setActivity(a))
      .catch((err) => console.error('[dashboard] activity failed:', err))
      .finally(() => setActivityLoading(false));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Range switch handler — kept in an event callback (not an effect)
  // so the setState calls stay out of the react-hooks/set-state-in-effect
  // rule's way. The cached bucket check means switching back to a
  // previously-viewed range is instant and doesn't re-fetch.
  const handleRangeChange = useCallback(
    (r: RangeDays) => {
      setRange(r);
      if (series[r] !== null) return;
      setSeriesLoading(true);
      const db = createClient();
      loadConversationsSeries(db, r)
        .then((s) => setSeries((prev) => ({ ...prev, [r]: s })))
        .catch((err) => console.error('[dashboard] series failed:', err))
        .finally(() => setSeriesLoading(false));
    },
    [series]
  );

  return (
    <div className="mx-auto max-w-[1480px] space-y-7 pb-20 lg:space-y-8 lg:pb-4">
      <div className="pt-1 sm:pt-3">
        <p className="text-primary text-sm font-medium">{t('eyebrow')}</p>
        <h1 className="text-foreground mt-1 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          {t('greeting', {
            name: profile?.full_name?.split(' ')[0] ?? t('defaultName'),
          })}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6 sm:text-base">
          {t('description')}
        </p>
      </div>

      <section aria-labelledby="daily-summary-title">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="daily-summary-title"
            className="text-lg font-semibold tracking-tight"
          >
            {t('dailySummary')}
          </h2>
          <span className="text-muted-foreground text-xs font-medium">
            {t('today')}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metricsLoading || !metrics ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <MetricCard
                title={t('conversations')}
                value={metrics.activeConversations.current.toLocaleString()}
                icon={MessageSquare}
                delta={{
                  sign: metrics.activeConversations.previous,
                  label: deltaLabel(
                    metrics.activeConversations.previous,
                    t('newTodayVsYesterday'),
                    t('noChange', { suffix: t('newTodayVsYesterday') })
                  ),
                }}
              />
              <MetricCard
                title={t('newClients')}
                value={metrics.newContactsToday.current.toLocaleString()}
                icon={UserPlus}
                delta={{
                  sign:
                    metrics.newContactsToday.current -
                    metrics.newContactsToday.previous,
                  label: deltaLabel(
                    metrics.newContactsToday.current -
                      metrics.newContactsToday.previous,
                    t('vsYesterday'),
                    t('noChange', { suffix: t('vsYesterday') })
                  ),
                }}
              />
              <MetricCard
                title={t('opportunities')}
                value={formatCurrency(metrics.openDealsValue, defaultCurrency)}
                icon={DollarSign}
                subtitle={t('openDeals', { count: metrics.openDealsCount })}
              />
              <MetricCard
                title={t('appointments')}
                value="—"
                icon={CalendarDays}
                subtitle={t('integrationPending')}
              />
            </>
          )}
        </div>
      </section>

      {metricsLoading || !metrics ? (
        <SkeletonCard />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.8fr)]">
          <AttentionCard
            openConversations={metrics.activeConversations.current}
            openDeals={metrics.openDealsCount}
          />
          <OnlineBusinessCard />
        </div>
      )}

      <QuickActions />

      <section aria-labelledby="results-title" className="space-y-4">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
            {t('insights')}
          </p>
          <h2
            id="results-title"
            className="mt-1 text-xl font-semibold tracking-tight"
          >
            {t('results')}
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="h-full lg:col-span-3">
            <ConversationsChart
              series={series}
              loading={seriesLoading}
              range={range}
              onRangeChange={handleRangeChange}
            />
          </div>
          <div className="h-full lg:col-span-2">
            <PipelineDonut
              data={pipeline}
              loading={pipelineLoading}
              currency={defaultCurrency}
            />
          </div>
        </div>
        <ResponseTimeChart data={responseTime} loading={responseTimeLoading} />
      </section>
      <ActivityFeed items={activity} loading={activityLoading} />
    </div>
  );
}

// ------------------------------------------------------------

function deltaLabel(
  delta: number,
  suffix: string,
  noChangeLabel: string
): string {
  if (delta === 0) return noChangeLabel;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toLocaleString()} ${suffix}`;
}
