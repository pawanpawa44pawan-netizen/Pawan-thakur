import {
  AdSenseConfig,
  AdSenseStats,
  LoopMediaItem,
  LoopSettings,
  StreamPlatform,
  StreamQualityConfig,
} from '../types/stream';

export const DEFAULT_PLATFORMS: StreamPlatform[] = [
  {
    id: 'youtube',
    name: 'YouTube Live',
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    streamKey: '',
    enabled: true,
    status: 'idle',
    viewers: 0,
    bitrateKbps: 0,
    health: 'Standby',
  },
  {
    id: 'facebook',
    name: 'Facebook Live',
    rtmpUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
    streamKey: '',
    enabled: true,
    status: 'idle',
    viewers: 0,
    bitrateKbps: 0,
    health: 'Standby',
  },
  {
    id: 'custom',
    name: 'Custom RTMP / Twitch',
    rtmpUrl: 'rtmp://live.twitch.tv/app/',
    streamKey: '',
    enabled: false,
    status: 'idle',
    viewers: 0,
    bitrateKbps: 0,
    health: 'Standby',
  },
];

// SVG Data URIs for clean, self-contained reliable thumbnails without relying on external or deleted assets
const createSvgThumbnail = (title: string, subtitle: string, bgColor: string, accentColor: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgColor}"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#grad)"/>
      <circle cx="560" cy="80" r="120" fill="${accentColor}" opacity="0.15"/>
      <rect x="48" y="48" width="80" height="26" rx="6" fill="${accentColor}" opacity="0.9"/>
      <text x="88" y="65" fill="#ffffff" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" dominant-baseline="middle">LIVE 24/7</text>
      <text x="48" y="240" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="bold">${title}</text>
      <text x="48" y="275" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="15">${subtitle}</text>
    </svg>
  `)}`;

export const DEFAULT_LOOP_PLAYLIST: LoopMediaItem[] = [
  {
    id: 'loop-1',
    title: 'Midnight Lo-Fi Beats & Chill Radio 24/7',
    category: 'Music Radio',
    durationSec: 3600,
    thumbnailUrl: createSvgThumbnail('Midnight Lo-Fi Beats', 'Chill Hip Hop & Study Ambience', '#1e1b4b', '#6366f1'),
    resolution: '1920x1080',
    fileSizeMb: 1420,
    enabled: true,
  },
  {
    id: 'loop-2',
    title: 'Himalayan Sunrise & River Ambience 4K',
    category: 'Nature Relaxation',
    durationSec: 5400,
    thumbnailUrl: createSvgThumbnail('Himalayan Nature 4K', 'Sunrise River Valley Soundscape', '#064e3b', '#10b981'),
    resolution: '1920x1080',
    fileSizeMb: 2180,
    enabled: true,
  },
  {
    id: 'loop-3',
    title: 'Evening Ghat Aarti & Devotional Chants',
    category: 'Devotional Live',
    durationSec: 2700,
    thumbnailUrl: createSvgThumbnail('Evening Ghat Aarti', 'Spiritual Chants & Ganga Aarti', '#7c2d12', '#f97316'),
    resolution: '1920x1080',
    fileSizeMb: 980,
    enabled: true,
  },
  {
    id: 'loop-4',
    title: 'Creator Talk & Podcast Highlights Loop',
    category: 'Talk & Podcast',
    durationSec: 1800,
    thumbnailUrl: createSvgThumbnail('Creator Talk Studio', '24/7 Tech & Entrepreneurship Feed', '#1e293b', '#e11d48'),
    resolution: '1920x1080',
    fileSizeMb: 740,
    enabled: true,
    isBackupFailover: true,
  },
];

export const DEFAULT_QUALITY_CONFIG: StreamQualityConfig = {
  resolution: '1080p60',
  videoBitrateKbps: 4500,
  audioBitrateKbps: 192,
  keyframeIntervalSec: 2,
  rateControl: 'CBR',
  lowLatency: true,
  cloudRegion: 'ap-south-1',
};

export const DEFAULT_LOOP_SETTINGS: LoopSettings = {
  infiniteLoop: true,
  shuffle: false,
  autoFailover: true,
  scheduleMode: '24_7',
  scheduleStart: '00:00',
  scheduleEnd: '23:59',
};

export const DEFAULT_ADSENSE_CONFIG: AdSenseConfig = {
  publisherId: 'ca-pub-8492019482710492',
  preRollSlotId: '4920184721',
  overlaySlotId: '7382910465',
  requireAdBeforeLive: true,
  midRollIntervalMin: 15,
  adFreeProPass: false,
};

export const DEFAULT_ADSENSE_STATS: AdSenseStats = {
  todayEarningsUsd: 42.85,
  monthEarningsUsd: 1184.4,
  totalImpressions: 28490,
  adGateUnlocks: 1342,
  clicks: 684,
  rpmUsd: 4.65,
  dailyHistory: [
    { day: 'Mon', earnings: 34.2, impressions: 7400 },
    { day: 'Tue', earnings: 38.9, impressions: 8350 },
    { day: 'Wed', earnings: 41.1, impressions: 8820 },
    { day: 'Thu', earnings: 36.5, impressions: 7890 },
    { day: 'Fri', earnings: 45.8, impressions: 9840 },
    { day: 'Sat', earnings: 49.4, impressions: 10620 },
    { day: 'Sun', earnings: 42.85, impressions: 9210 },
  ],
  recentEvents: [
    {
      id: 'ev-1',
      timestamp: '2 mins ago',
      type: 'Pre-Live Ad Gate',
      slotId: '4920184721',
      revenueUsd: 0.08,
    },
    {
      id: 'ev-2',
      timestamp: '14 mins ago',
      type: 'Mid-Roll Overlay',
      slotId: '7382910465',
      revenueUsd: 0.05,
    },
    {
      id: 'ev-3',
      timestamp: '29 mins ago',
      type: 'Sponsor Click',
      slotId: '4920184721',
      revenueUsd: 0.32,
    },
    {
      id: 'ev-4',
      timestamp: '45 mins ago',
      type: 'Pre-Live Ad Gate',
      slotId: '4920184721',
      revenueUsd: 0.07,
    },
  ],
};

export const CLOUD_REGIONS: {
  id: StreamQualityConfig['cloudRegion'];
  label: string;
  location: string;
  pingMs: number;
}[] = [
  { id: 'ap-south-1', label: 'Mumbai Relay', location: 'India (ap-south-1)', pingMs: 18 },
  { id: 'ap-southeast-1', label: 'Singapore Relay', location: 'SG (ap-southeast-1)', pingMs: 34 },
  { id: 'eu-central-1', label: 'Frankfurt Relay', location: 'EU (eu-central-1)', pingMs: 112 },
  { id: 'us-east-1', label: 'Virginia Relay', location: 'US East (us-east-1)', pingMs: 168 },
];

export const RESOLUTION_PRESETS: {
  id: StreamQualityConfig['resolution'];
  label: string;
  dimensions: string;
  fps: number;
  recommendedBitrate: number;
}[] = [
  { id: '1080p60', label: '1080p60 Full HD', dimensions: '1920 × 1080', fps: 60, recommendedBitrate: 4500 },
  { id: '1080p30', label: '1080p30 HD', dimensions: '1920 × 1080', fps: 30, recommendedBitrate: 3500 },
  { id: '720p60', label: '720p60 Smooth', dimensions: '1280 × 720', fps: 60, recommendedBitrate: 3000 },
  { id: '720p30', label: '720p30 Standard', dimensions: '1280 × 720', fps: 30, recommendedBitrate: 2200 },
  { id: '480p30', label: '480p30 Data Saver', dimensions: '854 × 480', fps: 30, recommendedBitrate: 1200 },
];
