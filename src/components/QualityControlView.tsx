import React from 'react';
import { Check, Cloud, Gauge, Sliders, Volume2, Zap } from 'lucide-react';
import { StreamQualityConfig } from '../types/stream';
import { CLOUD_REGIONS, RESOLUTION_PRESETS } from '../data/defaultStudioData';

interface QualityControlViewProps {
  quality: StreamQualityConfig;
  isLive: boolean;
  onUpdateQuality: (patch: Partial<StreamQualityConfig>) => void;
}

export const QualityControlView: React.FC<QualityControlViewProps> = ({
  quality,
  isLive,
  onUpdateQuality,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Stream Quality &amp; Cloud Encoder Control
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          All transcoding runs on dedicated cloud workers—adjust resolution and bitrate anytime with zero load on your phone.
        </p>
      </div>

      {/* Resolution Presets */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Output Video Resolution &amp; Frame Rate
            </h3>
          </div>
          {isLive && (
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Live Hot-Swap Enabled
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {RESOLUTION_PRESETS.map((preset) => {
            const selected = quality.resolution === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onUpdateQuality({
                    resolution: preset.id,
                    videoBitrateKbps: preset.recommendedBitrate,
                  })
                }
                className={`flex flex-col items-start rounded-lg border p-3.5 text-left transition-colors ${
                  selected
                    ? 'border-rose-600 bg-rose-50/70 dark:border-rose-500 dark:bg-rose-950/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {preset.label}
                  </span>
                  {selected && (
                    <Check className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <span className="mt-1 font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {preset.dimensions} · {preset.fps} fps
                </span>
                <span className="mt-2 font-mono text-[11px] text-slate-600 dark:text-slate-300 tabular-nums">
                  Rec: {preset.recommendedBitrate} kbps
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bitrate & Audio Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-slate-700 dark:text-slate-300" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Video Bitrate (Cloud Output)
              </h3>
            </div>
            <span className="font-mono text-sm font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
              {quality.videoBitrateKbps.toLocaleString()} kbps
            </span>
          </div>

          <input
            type="range"
            min={1000}
            max={8000}
            step={250}
            value={quality.videoBitrateKbps}
            onChange={(e) =>
              onUpdateQuality({ videoBitrateKbps: Number(e.target.value) })
            }
            className="mt-5 w-full accent-rose-600 cursor-pointer"
          />

          <div className="mt-2 flex justify-between font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>1,000 kbps (Saver)</span>
            <span>4,500 kbps (1080p60)</span>
            <span>8,000 kbps (Ultra)</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Rate Control
              </label>
              <div className="mt-2 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
                {(['CBR', 'VBR'] as const).map((rc) => (
                  <button
                    key={rc}
                    type="button"
                    onClick={() => onUpdateQuality({ rateControl: rc })}
                    className={`flex-1 rounded-md py-1.5 font-mono text-xs font-medium transition-colors ${
                      quality.rateControl === rc
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {rc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                Keyframe Interval
              </label>
              <div className="mt-2 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-950">
                {([2, 4] as const).map((kf) => (
                  <button
                    key={kf}
                    type="button"
                    onClick={() => onUpdateQuality({ keyframeIntervalSec: kf })}
                    className={`flex-1 rounded-md py-1.5 font-mono text-xs font-medium transition-colors ${
                      quality.keyframeIntervalSec === kf
                        ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {kf}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Audio & Low Latency */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Audio Bitrate &amp; Latency Mode
            </h3>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
              Stereo AAC Audio Quality
            </label>
            <div className="mt-2 grid grid-cols-3 gap-3">
              {([128, 192, 320] as const).map((ab) => (
                <button
                  key={ab}
                  type="button"
                  onClick={() => onUpdateQuality({ audioBitrateKbps: ab })}
                  className={`rounded-lg border py-2.5 font-mono text-xs font-medium transition-colors ${
                    quality.audioBitrateKbps === ab
                      ? 'border-rose-600 bg-rose-50/70 text-rose-700 dark:border-rose-500 dark:bg-rose-950/30 dark:text-rose-300'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {ab} kbps
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Ultra-Low Latency RTMP Push
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reduces YouTube &amp; Facebook glass-to-glass delay
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={quality.lowLatency}
              onClick={() => onUpdateQuality({ lowLatency: !quality.lowLatency })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                quality.lowLatency ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  quality.lowLatency ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Relay Server Region */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <Cloud className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Cloud Transcoding Server Region (Zero Phone Load)
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CLOUD_REGIONS.map((region) => {
            const active = quality.cloudRegion === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onUpdateQuality({ cloudRegion: region.id })}
                className={`flex items-center justify-between rounded-lg border p-3.5 text-left transition-colors ${
                  active
                    ? 'border-emerald-600 bg-emerald-50/60 dark:border-emerald-500 dark:bg-emerald-950/30'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {region.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {region.location}
                  </p>
                </div>
                <span className="font-mono text-xs font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {region.pingMs}ms
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
