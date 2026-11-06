import React, { useEffect, useState } from 'react';
import { CheckCircle2, ExternalLink, Lock, Play, ShieldCheck, X } from 'lucide-react';
import { AdSenseConfig } from '../types/stream';

interface AdGateModalProps {
  isOpen: boolean;
  isTestMode?: boolean;
  adSenseConfig: AdSenseConfig;
  enabledPlatformNames: string[];
  onClose: () => void;
  onAdCompleted: (clickedSponsor: boolean) => void;
}

const SPONSOR_ADS = [
  {
    advertiser: 'CloudScale CDN & Edge',
    headline: 'Ultra-Low Latency 4K Video Delivery Across 45+ Global PoPs',
    description:
      'Scale your 24/7 creator channels and OTT broadcasts with 99.99% uptime and instant RTMP ingest.',
    ctaText: 'Explore Cloud Plans',
    domain: 'cloudscale.example.com',
  },
  {
    advertiser: 'SoundCraft Pro Audio',
    headline: 'Royalty-Free Lo-Fi, Ambient & Devotional Stems for 24/7 Streams',
    description:
      'Cleared for YouTube Content ID and Facebook Rights Manager. Unlimited commercial broadcast license.',
    ctaText: 'Browse Audio Library',
    domain: 'soundcraft.example.com',
  },
];

export const AdGateModal: React.FC<AdGateModalProps> = ({
  isOpen,
  isTestMode = false,
  adSenseConfig,
  enabledPlatformNames,
  onClose,
  onAdCompleted,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [clickedSponsor, setClickedSponsor] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(5);
    setClickedSponsor(false);
    setAdIndex((prev) => (prev + 1) % SPONSOR_ADS.length);

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAd = SPONSOR_ADS[adIndex];
  const progressPct = ((5 - secondsLeft) / 5) * 100;
  const isUnlocked = secondsLeft === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adgate-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Google AdSense Pre-Live Gate {isTestMode ? '· Preview Mode' : ''}
            </p>
            <h2
              id="adgate-title"
              className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100"
            >
              {isUnlocked
                ? 'Ad Completed — Ready to Go Live 24/7'
                : 'Watch Sponsored Ad to Unlock 24/7 Cloud Stream'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            aria-label="Close ad gate"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* AdSense Creative Container */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              Ad · {currentAd.advertiser}
            </span>
            <span className="font-mono text-[11px]">
              {adSenseConfig.publisherId} / {adSenseConfig.preRollSlotId}
            </span>
          </div>

          <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            {currentAd.headline}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {currentAd.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {currentAd.domain}
            </span>
            <button
              type="button"
              onClick={() => setClickedSponsor(true)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                clickedSponsor
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {clickedSponsor ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Sponsor Visited (+$0.25 Bonus)</span>
                </>
              ) : (
                <>
                  <span>{currentAd.ctaText}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Countdown Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>
              {isUnlocked
                ? 'AdSense verification complete'
                : `Stream unlocks in ${secondsLeft}s...`}
            </span>
            <span className="font-mono tabular-nums">{Math.round(progressPct)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-rose-600 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Target Platforms Summary */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Destinations:{' '}
            <strong className="font-medium text-slate-800 dark:text-slate-200">
              {enabledPlatformNames.length > 0
                ? enabledPlatformNames.join(', ')
                : 'Preview Mode'}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Zero Phone Load
          </span>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isUnlocked}
            onClick={() => onAdCompleted(clickedSponsor)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 ${
              isUnlocked
                ? 'bg-rose-600 hover:bg-rose-700 cursor-pointer'
                : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
            }`}
          >
            {isUnlocked ? (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isTestMode ? 'Complete Test & Log Revenue' : 'Start 24/7 Live Stream'}</span>
              </>
            ) : (
              <>
                <Lock className="h-3.5 w-3.5" />
                <span>Wait {secondsLeft}s to Go Live</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
