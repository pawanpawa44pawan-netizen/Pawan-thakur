export type PlatformId = 'youtube' | 'facebook' | 'custom';

export interface StreamPlatform {
  id: PlatformId;
  name: string;
  rtmpUrl: string;
  streamKey: string;
  enabled: boolean;
  status: 'idle' | 'connecting' | 'live' | 'error';
  viewers: number;
  bitrateKbps: number;
  health: 'Excellent' | 'Good' | 'Standby';
}

export interface LoopMediaItem {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  thumbnailUrl: string;
  videoUrl?: string;
  resolution: string;
  fileSizeMb: number;
  enabled: boolean;
  isBackupFailover?: boolean;
}

export type ResolutionPreset = '1080p60' | '1080p30' | '720p60' | '720p30' | '480p30';

export interface StreamQualityConfig {
  resolution: ResolutionPreset;
  videoBitrateKbps: number;
  audioBitrateKbps: 128 | 192 | 320;
  keyframeIntervalSec: 2 | 4;
  rateControl: 'CBR' | 'VBR';
  lowLatency: boolean;
  cloudRegion: 'ap-south-1' | 'ap-southeast-1' | 'eu-central-1' | 'us-east-1';
}

export interface LoopSettings {
  infiniteLoop: boolean;
  shuffle: boolean;
  autoFailover: boolean;
  scheduleMode: '24_7' | 'scheduled';
  scheduleStart: string;
  scheduleEnd: string;
}

export interface AdSenseConfig {
  publisherId: string;
  preRollSlotId: string;
  overlaySlotId: string;
  requireAdBeforeLive: boolean;
  midRollIntervalMin: 0 | 15 | 30;
  adFreeProPass: boolean;
}

export interface AdSenseStats {
  todayEarningsUsd: number;
  monthEarningsUsd: number;
  totalImpressions: number;
  adGateUnlocks: number;
  clicks: number;
  rpmUsd: number;
  dailyHistory: { day: string; earnings: number; impressions: number }[];
  recentEvents: {
    id: string;
    timestamp: string;
    type: 'Pre-Live Ad Gate' | 'Mid-Roll Overlay' | 'Sponsor Click';
    slotId: string;
    revenueUsd: number;
  }[];
}
