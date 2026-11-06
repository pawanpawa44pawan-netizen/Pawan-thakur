import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeDollarSign,
  Check,
  Copy,
  Eye,
  EyeOff,
  Film,
  KeyRound,
  Menu,
  Moon,
  Play,
  Radio,
  Sliders,
  Square,
  Sun,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import {
  AdSenseConfig,
  AdSenseStats,
  LoopMediaItem,
  LoopSettings,
  PlatformId,
  StreamPlatform,
  StreamQualityConfig,
} from './types/stream';
import {
  DEFAULT_ADSENSE_CONFIG,
  DEFAULT_ADSENSE_STATS,
  DEFAULT_LOOP_PLAYLIST,
  DEFAULT_LOOP_SETTINGS,
  DEFAULT_PLATFORMS,
  DEFAULT_QUALITY_CONFIG,
} from './data/defaultStudioData';
import { LiveMonitor } from './components/LiveMonitor';
import { LoopPlaylistView } from './components/LoopPlaylistView';
import { QualityControlView } from './components/QualityControlView';
import { AdSenseView } from './components/AdSenseView';
import { AdGateModal } from './components/AdGateModal';

type NavTab = 'studio' | 'loop' | 'quality' | 'adsense';

const STORAGE_KEY = 'streamloop_studio_state_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Studio State
  const [platforms, setPlatforms] = useState<StreamPlatform[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.platforms)) return parsed.platforms;
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PLATFORMS;
  });

  const [playlist, setPlaylist] = useState<LoopMediaItem[]>(DEFAULT_LOOP_PLAYLIST);
  const [activeMediaId, setActiveMediaId] = useState<string>(DEFAULT_LOOP_PLAYLIST[0].id);

  const [quality, setQuality] = useState<StreamQualityConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.quality) return parsed.quality;
      }
    } catch {
      // ignore
    }
    return DEFAULT_QUALITY_CONFIG;
  });

  const [loopSettings, setLoopSettings] = useState<LoopSettings>(DEFAULT_LOOP_SETTINGS);
  const [adSenseConfig, setAdSenseConfig] = useState<AdSenseConfig>(DEFAULT_ADSENSE_CONFIG);
  const [adSenseStats, setAdSenseStats] = useState<AdSenseStats>(DEFAULT_ADSENSE_STATS);

  // Live Broadcast State
  const [isLive, setIsLive] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const [autoGoLiveOnKey, setAutoGoLiveOnKey] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Ad-Gate Modal State
  const [adGateOpen, setAdGateOpen] = useState(false);
  const [adGateTestMode, setAdGateTestMode] = useState(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist key settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          platforms: platforms.map((p) => ({ ...p, status: 'idle', viewers: 0, bitrateKbps: 0 })),
          quality,
        })
      );
    } catch {
      // ignore
    }
  }, [platforms, quality]);

  // Live uptime & viewer simulation tick
  useEffect(() => {
    if (!isLive) {
      setUptimeSeconds(0);
      return;
    }

    const interval = window.setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      setPlatforms((prev) =>
        prev.map((p) => {
          if (!p.enabled || p.status !== 'live') return p;
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...p,
            viewers: Math.max(12, p.viewers + delta),
            bitrateKbps: quality.videoBitrateKbps,
          };
        })
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isLive, quality.videoBitrateKbps]);

  const activeMedia = useMemo(
    () => playlist.find((item) => item.id === activeMediaId) || playlist[0],
    [playlist, activeMediaId]
  );

  const enabledPlatforms = useMemo(
    () => platforms.filter((p) => p.enabled),
    [platforms]
  );

  const hasValidEnabledKey = useMemo(
    () => enabledPlatforms.some((p) => p.streamKey.trim().length >= 6),
    [enabledPlatforms]
  );

  const startCloudBroadcast = () => {
    setIsLive(true);
    setPlatforms((prev) =>
      prev.map((p) => {
        if (!p.enabled) return { ...p, status: 'idle', viewers: 0, bitrateKbps: 0 };
        const initialViewers =
          p.id === 'youtube' ? 148 : p.id === 'facebook' ? 94 : 36;
        return {
          ...p,
          status: 'live',
          viewers: initialViewers,
          bitrateKbps: quality.videoBitrateKbps,
          health: 'Excellent',
        };
      })
    );
    setStatusBanner(
      `24/7 Cloud Stream is now LIVE on ${enabledPlatforms
        .map((p) => p.name)
        .join(' & ')}. Phone CPU load: 0%.`
    );
  };

  const stopCloudBroadcast = () => {
    setIsLive(false);
    setPlatforms((prev) =>
      prev.map((p) => ({
        ...p,
        status: 'idle',
        viewers: 0,
        bitrateKbps: 0,
        health: 'Standby',
      }))
    );
    setStatusBanner('24/7 Cloud Broadcast stopped.');
  };

  const handleGoLiveClick = () => {
    if (isLive) {
      stopCloudBroadcast();
      return;
    }

    if (enabledPlatforms.length === 0) {
      setStatusBanner('Enable at least one platform (YouTube or Facebook) to go live.');
      return;
    }

    if (!hasValidEnabledKey) {
      setStatusBanner(
        'Enter your YouTube or Facebook Stream Key below (or click "Fill Demo Keys") to start.'
      );
      setActiveTab('studio');
      return;
    }

    // If AdSense Pre-Live Ad Gate is enabled & user doesn't have Ad-Free Pro Pass, show Ad Gate first
    if (adSenseConfig.requireAdBeforeLive && !adSenseConfig.adFreeProPass) {
      setAdGateTestMode(false);
      setAdGateOpen(true);
      return;
    }

    startCloudBroadcast();
  };

  const handleAdCompleted = (clickedSponsor: boolean) => {
    const earned = clickedSponsor ? 0.33 : 0.08;
    setAdSenseStats((prev) => ({
      ...prev,
      todayEarningsUsd: Number((prev.todayEarningsUsd + earned).toFixed(2)),
      monthEarningsUsd: Number((prev.monthEarningsUsd + earned).toFixed(2)),
      totalImpressions: prev.totalImpressions + 1,
      adGateUnlocks: prev.adGateUnlocks + 1,
      clicks: prev.clicks + (clickedSponsor ? 1 : 0),
      recentEvents: [
        {
          id: `ev-${Date.now()}`,
          timestamp: 'Just now',
          type: clickedSponsor ? 'Sponsor Click' : 'Pre-Live Ad Gate',
          slotId: adSenseConfig.preRollSlotId,
          revenueUsd: earned,
        },
        ...prev.recentEvents.slice(0, 9),
      ],
    }));

    setAdGateOpen(false);
    if (!adGateTestMode) {
      startCloudBroadcast();
    } else {
      setStatusBanner(`Test Ad completed! +$${earned.toFixed(2)} logged to AdSense.`);
    }
  };

  const handleStreamKeyChange = (id: PlatformId, value: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, streamKey: value, enabled: true } : p))
    );

    // Instant Go-Live when a stream key is pasted/entered if autoGoLiveOnKey is active
    if (autoGoLiveOnKey && !isLive && value.trim().length >= 12) {
      if (adSenseConfig.requireAdBeforeLive && !adSenseConfig.adFreeProPass) {
        setAdGateTestMode(false);
        setAdGateOpen(true);
      } else {
        startCloudBroadcast();
      }
    }
  };

  const handleFillDemoKeys = () => {
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === 'youtube') {
          return { ...p, enabled: true, streamKey: 'yt-live-8f92-4k10-992a-cloud' };
        }
        if (p.id === 'facebook') {
          return { ...p, enabled: true, streamKey: 'FB-247019482-0-AbCdEfGhIjKlMnOp' };
        }
        return p;
      })
    );
    setStatusBanner('YouTube & Facebook demo stream keys loaded. Click "Go Live 24/7" to start!');
  };

  const handleCopyKey = (id: string, key: string) => {
    if (!key) return;
    navigator.clipboard?.writeText(key);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1500);
  };

  const handleNextLoopItem = () => {
    const enabledItems = playlist.filter((i) => i.enabled);
    if (enabledItems.length === 0) return;
    const currentIdx = enabledItems.findIndex((i) => i.id === activeMediaId);
    const nextIdx = loopSettings.shuffle
      ? Math.floor(Math.random() * enabledItems.length)
      : (currentIdx + 1) % enabledItems.length;
    setActiveMediaId(enabledItems[nextIdx].id);
  };

  const handleMoveMedia = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= playlist.length) return;
    const copy = [...playlist];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    setPlaylist(copy);
  };

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'studio', label: 'Live Studio', icon: Radio },
    { id: 'loop', label: '24/7 Loop Playlist', icon: Film },
    { id: 'quality', label: 'Stream Quality', icon: Sliders },
    { id: 'adsense', label: 'AdSense & Earnings', icon: BadgeDollarSign },
  ];

  const currentTabLabel =
    navItems.find((n) => n.id === activeTab)?.label || 'Live Studio';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Desktop Sidebar (256px) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white dark:lg:border-slate-800 dark:lg:bg-slate-900">
        <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0">
            StreamLoop
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Theme Toggle */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <span>{darkMode ? 'Dark Studio' : 'Light Studio'}</span>
            {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </aside>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
            <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                StreamLoop
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${
                      active
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="border-t border-slate-200 p-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300"
              >
                <span>{darkMode ? 'Dark Studio' : 'Light Studio'}</span>
                {darkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-sm truncate">
              <span className="font-semibold text-slate-900 dark:text-slate-100 lg:hidden">
                StreamLoop
              </span>
              <span className="hidden lg:inline text-slate-500 dark:text-slate-400">
                Cloud Broadcast
              </span>
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {currentTabLabel}
              </span>
            </div>
          </div>

          {/* Primary Action CTA */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleGoLiveClick}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isLive
                  ? 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isLive ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Stop Broadcast</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Go Live 24/7</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Status Notification Banner */}
          {statusBanner && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <span>{statusBanner}</span>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="space-y-6">
              {/* Live Cloud Broadcast Monitor + Zero Phone Load Strip */}
              <LiveMonitor
                isLive={isLive}
                uptimeSeconds={uptimeSeconds}
                activeMedia={activeMedia}
                platforms={platforms}
                quality={quality}
                loopSettings={loopSettings}
                adSenseConfig={adSenseConfig}
                onNextLoopItem={handleNextLoopItem}
              />

              {/* Multi-Platform Stream Keys (YouTube + Facebook + Custom RTMP) */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Multi-Platform Stream Keys (YouTube &amp; Facebook)
                      </h2>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      Paste your YouTube or Facebook Live Stream Key to start 24/7 cloud broadcasting immediately.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoGoLiveOnKey}
                        onChange={(e) => setAutoGoLiveOnKey(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 accent-rose-600"
                      />
                      <span>Auto-Go Live on Key Paste</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleFillDemoKeys}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                    >
                      <Wand2 className="h-3.5 w-3.5" />
                      <span>Fill Demo Keys</span>
                    </button>
                  </div>
                </div>

                {/* Platform Rows */}
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {platforms.map((platform) => {
                    const isKeyVisible = Boolean(visibleKeys[platform.id]);
                    return (
                      <div
                        key={platform.id}
                        className="py-5 first:pt-5 last:pb-1 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center"
                      >
                        {/* Platform Name & Toggle */}
                        <div className="lg:col-span-3 flex items-center justify-between lg:justify-start gap-3">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={platform.enabled}
                            onClick={() =>
                              setPlatforms((prev) =>
                                prev.map((p) =>
                                  p.id === platform.id ? { ...p, enabled: !p.enabled } : p
                                )
                              )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                              platform.enabled
                                ? 'bg-rose-600'
                                : 'bg-slate-300 dark:bg-slate-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                platform.enabled ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>

                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {platform.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {platform.status === 'live' ? (
                                <span className="font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
                                  Live · {platform.viewers} viewers · {platform.bitrateKbps} kbps
                                </span>
                              ) : platform.enabled ? (
                                'Ready for 24/7 push'
                              ) : (
                                'Disabled'
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Stream Key Input */}
                        <div className="lg:col-span-5">
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            {platform.name} Stream Key
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              type={isKeyVisible ? 'text' : 'password'}
                              placeholder={`Paste ${platform.name} stream key here...`}
                              value={platform.streamKey}
                              onChange={(e) =>
                                handleStreamKeyChange(platform.id, e.target.value)
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setVisibleKeys((prev) => ({
                                  ...prev,
                                  [platform.id]: !prev[platform.id],
                                }))
                              }
                              className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              aria-label={isKeyVisible ? 'Hide stream key' : 'Show stream key'}
                            >
                              {isKeyVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyKey(platform.id, platform.streamKey)}
                              className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              aria-label="Copy stream key"
                            >
                              {copiedId === platform.id ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* RTMP Server URL */}
                        <div className="lg:col-span-4">
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                            RTMP Ingest URL
                          </label>
                          <input
                            type="text"
                            value={platform.rtmpUrl}
                            onChange={(e) =>
                              setPlatforms((prev) =>
                                prev.map((p) =>
                                  p.id === platform.id
                                    ? { ...p, rtmpUrl: e.target.value }
                                    : p
                                )
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700 focus:border-rose-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* AdSense Gate Notice Bar */}
                <div className="mt-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>
                      {adSenseConfig.requireAdBeforeLive && !adSenseConfig.adFreeProPass
                        ? 'AdSense Pre-Live Gate Active: A 5-second sponsored ad plays before unlocking your 24/7 cloud stream.'
                        : 'Direct Go-Live Active: Pre-Live AdSense Gate is currently bypassed.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('adsense')}
                    className="text-xs font-semibold text-rose-600 hover:underline dark:text-rose-400 whitespace-nowrap shrink-0 text-left"
                  >
                    Configure AdSense →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loop' && (
            <LoopPlaylistView
              playlist={playlist}
              activeMediaId={activeMediaId}
              loopSettings={loopSettings}
              onSelectMedia={(id) => setActiveMediaId(id)}
              onToggleMediaEnabled={(id) =>
                setPlaylist((prev) =>
                  prev.map((item) =>
                    item.id === id ? { ...item, enabled: !item.enabled } : item
                  )
                )
              }
              onMoveMedia={handleMoveMedia}
              onDeleteMedia={(id) =>
                setPlaylist((prev) => prev.filter((item) => item.id !== id))
              }
              onAddMedia={(newItem) => {
                setPlaylist((prev) => [newItem, ...prev]);
                setActiveMediaId(newItem.id);
              }}
              onUpdateLoopSettings={(patch) =>
                setLoopSettings((prev) => ({ ...prev, ...patch }))
              }
            />
          )}

          {activeTab === 'quality' && (
            <QualityControlView
              quality={quality}
              isLive={isLive}
              onUpdateQuality={(patch) =>
                setQuality((prev) => ({ ...prev, ...patch }))
              }
            />
          )}

          {activeTab === 'adsense' && (
            <AdSenseView
              config={adSenseConfig}
              stats={adSenseStats}
              onUpdateConfig={(patch) =>
                setAdSenseConfig((prev) => ({ ...prev, ...patch }))
              }
              onTestAdGate={() => {
                setAdGateTestMode(true);
                setAdGateOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Google AdSense Pre-Live Ad Gate Modal */}
      <AdGateModal
        isOpen={adGateOpen}
        isTestMode={adGateTestMode}
        adSenseConfig={adSenseConfig}
        enabledPlatformNames={enabledPlatforms.map((p) => p.name)}
        onClose={() => setAdGateOpen(false)}
        onAdCompleted={handleAdCompleted}
      />
    </div>
  );
}
