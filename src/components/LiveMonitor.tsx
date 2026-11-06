import React, { useEffect, useState } from 'react';
import {
  Activity,
  Cloud,
  Radio,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AdSenseConfig,
  LoopMediaItem,
  LoopSettings,
  StreamPlatform,
  StreamQualityConfig,
} from '../types/stream';
import { CLOUD_REGIONS, RESOLUTION_PRESETS } from '../data/defaultStudioData';

interface LiveMonitorProps {
  isLive: boolean;
  uptimeSeconds: number;
  activeMedia: LoopMediaItem;
  platforms: StreamPlatform[];
  quality: StreamQualityConfig;
  loopSettings: LoopSettings;
  adSenseConfig: AdSenseConfig;
  onNextLoopItem: () => void;
}

function formatUptime(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

export const LiveMonitor: React.FC<LiveMonitorProps> = ({
  isLive,
  uptimeSeconds,
  activeMedia,
  platforms,
  quality,
  loopSettings,
  adSenseConfig,
  onNextLoopItem,
}) => {
  const [muted, setMuted] = useState(true);
  const [vuLevels, setVuLevels] = useState<[number, number]>([64, 58]);
  const [showMidRollBanner, setShowMidRollBanner] = useState(false);

  const activePlatforms = platforms.filter((p) => p.enabled && p.status === 'live');
  const totalViewers = activePlatforms.reduce((acc, p) => acc + p.viewers, 0);
  const regionInfo =
    CLOUD_REGIONS.find((r) => r.id === quality.cloudRegion) || CLOUD_REGIONS[0];
  const resInfo =
    RESOLUTION_PRESETS.find((r) => r.id === quality.resolution) || RESOLUTION_PRESETS[0];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVuLevels([
        Math.floor(45 + Math.random() * 42),
        Math.floor(42 + Math.random() * 44),
      ]);
    }, 350);
    return () => window.clearInterval(interval);
  }, []);

  // Periodically show AdSense Mid-Roll Overlay when live & enabled
  useEffect(() => {
    if (!isLive || adSenseConfig.midRollIntervalMin === 0 || adSenseConfig.adFreeProPass) {
      setShowMidRollBanner(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setShowMidRollBanner(true);
    }, 4000);
    return () => window.clearTimeout(timer);
  }, [isLive, adSenseConfig.midRollIntervalMin, adSenseConfig.adFreeProPass]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* 16:9 Broadcast Viewport */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-slate-950">
        {activeMedia.videoUrl ? (
          <video
            key={activeMedia.videoUrl}
            src={activeMedia.videoUrl}
            autoPlay
            loop={loopSettings.infiniteLoop}
            muted={muted}
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src={activeMedia.thumbnailUrl}
            alt={activeMedia.title}
            referrerPolicy="no-referrer"
            className={`h-full w-full object-cover transition-transform duration-1000 ${
              isLive ? 'scale-105' : 'scale-100'
            }`}
          />
        )}

        {/* Measured Contrast Scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50" />

        {/* Top Broadcast Bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                LIVE 24/7
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900/85 px-2.5 py-1 text-xs font-medium text-slate-200 border border-white/15">
                Cloud Standby
              </span>
            )}
            <span className="font-mono text-xs font-medium text-white tabular-nums">
              {formatUptime(uptimeSeconds)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block font-mono text-xs text-slate-200 bg-black/50 px-2.5 py-1 rounded-md">
              {resInfo.dimensions} · {resInfo.fps}fps · {quality.videoBitrateKbps} kbps
            </span>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              className="rounded-md bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
              aria-label={muted ? 'Unmute preview' : 'Mute preview'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Optional AdSense Mid-Roll Overlay Banner */}
        {showMidRollBanner && isLive && (
          <div className="absolute inset-x-4 bottom-16 flex items-center justify-between gap-3 rounded-lg border border-amber-400/40 bg-slate-950/90 px-4 py-2.5 text-white backdrop-blur-xs">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-amber-400">
                AdSense Mid-Roll Overlay · Slot {adSenseConfig.overlaySlotId}
              </p>
              <p className="truncate text-xs text-slate-200">
                Sponsored: Upgrade your creator studio audio with SoundCraft Pro Stems
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowMidRollBanner(false)}
              className="shrink-0 rounded bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/25"
            >
              Hide
            </button>
          </div>
        )}

        {/* Bottom Broadcast Info & Audio VU Meter */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="text-xs text-slate-300">
              Now Looping · {activeMedia.category}
              {loopSettings.infiniteLoop ? ' · Infinite 24/7 Loop' : ''}
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold text-white">
              {activeMedia.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Stereo VU Meter */}
            <div className="hidden sm:flex flex-col gap-1 w-24">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-emerald-400 transition-all duration-150"
                  style={{ width: `${vuLevels[0]}%` }}
                />
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-emerald-400 transition-all duration-150"
                  style={{ width: `${vuLevels[1]}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onNextLoopItem}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/25 whitespace-nowrap shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Next Loop</span>
            </button>
          </div>
        </div>
      </div>

      {/* Zero Phone Load vs. Cloud Worker Telemetry Strip */}
      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-4 sm:divide-x sm:divide-y-0 dark:divide-slate-800">
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Your Phone Load</span>
          </div>
          <p className="mt-1 font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
            0% CPU · 0 MB/s
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Safe to close phone or tab
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Cloud className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            <span>Cloud Relay Server</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {regionInfo.label}
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {regionInfo.pingMs}ms ingest · {quality.rateControl}
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Radio className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
            <span>Active Platforms</span>
          </div>
          <p className="mt-1 font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {activePlatforms.length} / {platforms.filter((p) => p.enabled).length} Live
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {totalViewers.toLocaleString()} watching now
          </p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
            <span>Cloud Encoder</span>
          </div>
          <p className="mt-1 font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {isLive ? `${quality.videoBitrateKbps} kbps` : 'Ready'}
          </p>
          <p className="mt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            0 dropped frames
          </p>
        </div>
      </div>
    </div>
  );
};
