export interface BackupItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'system';
  size: string;
  lastBackup: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  versions: number;
}

export interface BackupSchedule {
  id: string;
  name: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  nextRun: string;
}

export interface StorageStats {
  used: number;
  total: number;
  backupCount: number;
  lastBackup: string;
}

export interface RecoveryPoint {
  id: string;
  date: string;
  size: string;
  type: 'full' | 'incremental';
  status: 'available' | 'restoring';
}
