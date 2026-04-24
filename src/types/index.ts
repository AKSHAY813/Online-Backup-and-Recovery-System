export interface BackupItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'system' | 'web' | 'image' | 'video' | 'document' | 'other';
  size: string;
  lastBackup: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  versions: number;
  url?: string;
  isRestored?: boolean;
  restoredAt?: string;
  isVaulted?: boolean;
  vaultPasskey?: string;
  failedAttempts?: number;
  lockoutUntil?: string;
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  nextRun: string;
}

export interface CategoryStat {
  used: string;
  backedUp: number;
  downloaded: number;
  totalOnDevice: number;
}

export interface StorageStats {
  used: number;
  total: number;
  backupCount: number;
  lastBackup: string;
  firebaseFileCount?: number;
  categories?: {
    video: CategoryStat;
    document: CategoryStat;
    desktop: CategoryStat;
    download: CategoryStat;
  };
}

export interface RecoveryPoint {
  id: string;
  date: string;
  size: string;
  type: 'full' | 'incremental';
  status: 'available' | 'restoring';
}
