import React from 'react';
import {
  BadgeDollarSign,
  Eye,
  Lock,
  MousePointerClick,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { AdSenseConfig, AdSenseStats } from '../types/stream';

interface AdSenseViewProps {
  config: AdSenseConfig;
  stats: AdSenseStats;
  onUpdateConfig: (patch: Partial<AdSenseConfig>) => void;
  onTestAdGate: () => void;
}

export const AdSenseView: React.FC<AdSenseViewProps> = ({
  config,
  stats,
  onUpdateConfig,
  onTestAdGate,
}) => {
  const maxEarnings = Math.max(...stats.dailyHistory.map((d) => d.earnings), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            AdSense &amp; Pre-Live Ad Monetization
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Show Google AdSense ads before users go live and during 24/7 stream breaks to monetize every broadcast.
          </p>
        </div>

        <button
          type="button"
          onClick={onTestAdGate}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 whitespace-nowrap shrink-0"
        >
          <PlayCircle className="h-4 w-4" />
          <span>Preview &amp; Test Pre-Live Ad</span>
        </button>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Today&apos;s AdSense Revenue</span>
            <BadgeDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            ${stats.todayEarningsUsd.toFixed(2)}
          </p>
          <p className="mt-1 font-mono text-xs text-emerald-700 dark:text-emerald-400 tabular-nums">
            Month: ${stats.monthEarningsUsd.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Ad Impressions</span>
            <Eye className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.totalImpressions.toLocaleString()}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            RPM: ${stats.rpmUsd.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Pre-Live Ad Unlocks</span>
            <Lock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.adGateUnlocks.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Streams unlocked after ad
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Sponsor Clicks (CTR)</span>
            <MousePointerClick className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {stats.clicks.toLocaleString()}
          </p>
          <p className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {((stats.clicks / Math.max(stats.totalImpressions, 1)) * 100).toFixed(2)}% CTR
          </p>
        </div>
      </div>

      {/* AdSense Configuration & 7-Day Revenue Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            AdSense Publisher &amp; Ad-Gate Rules
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Google AdSense Publisher ID
              </label>
              <input
                type="text"
                value={config.publisherId}
                onChange={(e) => onUpdateConfig({ publisherId: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Pre-Live Ad Slot ID
                </label>
                <input
                  type="text"
                  value={config.preRollSlotId}
                  onChange={(e) => onUpdateConfig({ preRollSlotId: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                  Mid-Roll Overlay Slot ID
                </label>
                <input
                  type="text"
                  value={config.overlaySlotId}
                  onChange={(e) => onUpdateConfig({ overlaySlotId: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Require Ad Before Going Live
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Users watch a 5s AdSense ad to unlock 24/7 streaming
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={config.requireAdBeforeLive}
                onClick={() =>
                  onUpdateConfig({
                    requireAdBeforeLive: !config.requireAdBeforeLive,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  config.requireAdBeforeLive
                    ? 'bg-rose-600'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    config.requireAdBeforeLive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Mid-Roll Stream Banner Interval
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Display non-intrusive AdSense banner during 24/7 loop
                </p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
                {([0, 15, 30] as const).map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => onUpdateConfig({ midRollIntervalMin: min })}
                    className={`rounded-md px-2.5 py-1 font-mono text-xs font-medium transition-colors ${
                      config.midRollIntervalMin === min
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {min === 0 ? 'Off' : `${min}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Revenue Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                7-Day AdSense Earnings (USD)
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Last 7 days
            </span>
          </div>

          <div className="mt-6 flex h-48 items-end justify-between gap-3 pt-4">
            {stats.dailyHistory.map((item) => {
              const heightPct = Math.max(12, Math.round((item.earnings / maxEarnings) * 100));
              return (
                <div
                  key={item.day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
                    ${item.earnings.toFixed(0)}
                  </span>
                  <div className="w-full max-w-[36px] rounded-t-md bg-slate-100 dark:bg-slate-800 h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-t-md bg-rose-600 transition-all duration-300"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent AdSense Monetization Events */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent AdSense Monetization Activity
          </h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {stats.recentEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between px-5 py-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {ev.type}
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  Slot {ev.slotId}
                </span>
              </div>
              <div className="flex items-center gap-4 font-mono tabular-nums">
                <span className="text-slate-500 dark:text-slate-400">
                  {ev.timestamp}
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  +${ev.revenueUsd.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
