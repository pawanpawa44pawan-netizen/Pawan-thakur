import React, { useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Film,
  Infinity as InfinityIcon,
  Play,
  Plus,
  ShieldAlert,
  Shuffle,
  Trash2,
  Upload,
} from 'lucide-react';
import { LoopMediaItem, LoopSettings } from '../types/stream';

interface LoopPlaylistViewProps {
  playlist: LoopMediaItem[];
  activeMediaId: string;
  loopSettings: LoopSettings;
  onSelectMedia: (id: string) => void;
  onToggleMediaEnabled: (id: string) => void;
  onMoveMedia: (index: number, direction: 'up' | 'down') => void;
  onDeleteMedia: (id: string) => void;
  onAddMedia: (item: LoopMediaItem) => void;
  onUpdateLoopSettings: (patch: Partial<LoopSettings>) => void;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${String(s).padStart(2, '0')}s`;
}

export const LoopPlaylistView: React.FC<LoopPlaylistViewProps> = ({
  playlist,
  activeMediaId,
  loopSettings,
  onSelectMedia,
  onToggleMediaEnabled,
  onMoveMedia,
  onDeleteMedia,
  onAddMedia,
  onUpdateLoopSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('24/7 Loop');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const sizeMb = Math.max(1, Math.round(file.size / (1024 * 1024)));
    onAddMedia({
      id: `loop-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Uploaded Cloud Video',
      durationSec: 1800,
      thumbnailUrl: playlist[0]?.thumbnailUrl || '',
      videoUrl: objectUrl,
      resolution: '1920x1080',
      fileSizeMb: sizeMb,
      enabled: true,
    });
    e.target.value = '';
  };

  const handleAddUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddMedia({
      id: `loop-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim() || '24/7 Loop',
      durationSec: 3600,
      thumbnailUrl: playlist[1]?.thumbnailUrl || playlist[0]?.thumbnailUrl || '',
      videoUrl: newVideoUrl.trim() || undefined,
      resolution: '1920x1080',
      fileSizeMb: 1250,
      enabled: true,
    });
    setNewTitle('');
    setNewVideoUrl('');
    setShowUrlForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            24/7 Continuous Loop &amp; Playlist
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Videos loop automatically on our cloud servers 24/7 without manual effort or phone battery drain.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload Video</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUrlForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Stream / Video URL</span>
          </button>
        </div>
      </div>

      {/* Add Video URL Form */}
      {showUrlForm && (
        <form
          onSubmit={handleAddUrlSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Add Cloud Video or MP4/HLS Source to 24/7 Loop
          </h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Stream / Video Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Bhajan 24/7 Live"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Category
              </label>
              <input
                type="text"
                placeholder="Music / Devotional / Gaming"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                MP4 / M3U8 URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://cdn.example.com/video.mp4"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-rose-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowUrlForm(false)}
              className="rounded-lg border border-slate-300 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
            >
              Add to 24/7 Queue
            </button>
          </div>
        </form>
      )}

      {/* Automation & Loop Controls Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <InfinityIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Infinite 24/7 Loop
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-repeat queue forever
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={loopSettings.infiniteLoop}
            onClick={() =>
              onUpdateLoopSettings({ infiniteLoop: !loopSettings.infiniteLoop })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              loopSettings.infiniteLoop
                ? 'bg-rose-600'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                loopSettings.infiniteLoop ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Shuffle className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Shuffle Playlist
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Randomize next loop item
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={loopSettings.shuffle}
            onClick={() => onUpdateLoopSettings({ shuffle: !loopSettings.shuffle })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              loopSettings.shuffle ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                loopSettings.shuffle ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Auto-Failover Backup
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Never drop live stream
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={loopSettings.autoFailover}
            onClick={() =>
              onUpdateLoopSettings({ autoFailover: !loopSettings.autoFailover })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              loopSettings.autoFailover
                ? 'bg-emerald-600'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                loopSettings.autoFailover ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Broadcast Schedule
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {loopSettings.scheduleMode === '24_7'
                  ? 'Non-stop 24/7 Cloud'
                  : `${loopSettings.scheduleStart} – ${loopSettings.scheduleEnd}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdateLoopSettings({
                scheduleMode:
                  loopSettings.scheduleMode === '24_7' ? 'scheduled' : '24_7',
              })
            }
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            {loopSettings.scheduleMode === '24_7' ? '24/7' : 'Timed'}
          </button>
        </div>
      </div>

      {/* Playlist Queue Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {playlist.length === 0 ? (
          <div className="p-10 text-center">
            <Film className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              No videos in your 24/7 loop queue
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Upload a video file or add a cloud video URL to start continuous 24/7 streaming.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload First Video</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {playlist.map((item, idx) => {
              const isCurrent = item.id === activeMediaId;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col gap-4 p-4 transition-colors sm:flex-row sm:items-center sm:justify-between ${
                    isCurrent
                      ? 'bg-rose-50/60 dark:bg-rose-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="font-mono text-xs text-slate-400 w-5 text-center tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 shrink-0">
                            · Active Loop
                          </span>
                        )}
                        {item.isBackupFailover && (
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                            · Failover Backup
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        {item.category} · {formatDuration(item.durationSec)} ·{' '}
                        {item.resolution} · {item.fileSizeMb} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 shrink-0">
                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => onSelectMedia(item.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                      >
                        <Play className="h-3 w-3" />
                        <span>Play Now</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onToggleMediaEnabled(item.id)}
                      className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        item.enabled
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {item.enabled ? 'In Loop' : 'Paused'}
                    </button>

                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => onMoveMedia(idx, 'up')}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                      aria-label="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === playlist.length - 1}
                      onClick={() => onMoveMedia(idx, 'down')}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-800"
                      aria-label="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={playlist.length <= 1}
                      onClick={() => onDeleteMedia(item.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
