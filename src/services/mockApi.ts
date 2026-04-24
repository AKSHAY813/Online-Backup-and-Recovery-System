const DELAY = 800;
import { database, ref, set, get, child, isFirebaseEnabled } from './firebaseConfig';
import type { BackupItem, StorageStats } from '@/types';

const INITIAL_SYSTEM_FILES: BackupItem[] = [
  { id: 'sys1', name: 'Annual_Report_2023.pdf', size: '12.4 MB', lastBackup: '-', type: 'document', versions: 0, status: 'pending' },
  { id: 'sys2', name: 'Presentation_Final.pptx', size: '45.2 MB', lastBackup: '-', type: 'document', versions: 0, status: 'pending' },
  { id: 'sys3', name: 'Vacation_Video.mp4', size: '1.2 GB', lastBackup: '-', type: 'video', versions: 0, status: 'pending' },
  { id: 'sys4', name: 'Profile_Picture.png', size: '2.1 MB', lastBackup: '-', type: 'image', versions: 0, status: 'pending' },
  { id: 'sys5', name: 'Project_Assets.zip', size: '240.5 MB', lastBackup: '-', type: 'other', versions: 0, status: 'pending' },
  { id: 'sys6', name: 'Tutorial_Screen_Record.mov', size: '850.0 MB', lastBackup: '-', type: 'video', versions: 0, status: 'pending' },
  { id: 'sys7', name: 'Download_Log_v1.txt', size: '45 KB', lastBackup: '-', type: 'document', versions: 0, status: 'pending' },
  { id: 'sys8', name: 'App_Installer.exe', size: '120.0 MB', lastBackup: '-', type: 'other', versions: 0, status: 'pending' },
];

interface User {
  name: string;
  email: string;
  plan: string;
  avatar?: string;
  password?: string;
}

interface UserSettings {
  encryption: boolean;
  compression: boolean;
  mfa: boolean;
  notifications: boolean;
  autoUpdate: boolean;
  bandwidth: string;
  retention: string;
  versions: string;
  totalStorage: number;
}

interface BackupVersion {
  id: string;
  timestamp: string;
  size: string;
  hash: string;
  node: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  encryption: true,
  compression: true,
  mfa: true,
  notifications: true,
  autoUpdate: true,
  bandwidth: 'unlimited',
  retention: '30',
  versions: '10',
  totalStorage: 512,
};

const INITIAL_STATS: StorageStats = {
  used: 24.5,
  total: 500,
  backupCount: 12,
  lastBackup: 'Today, 2:45 PM',
  firebaseFileCount: 8,
  categories: {
    video: { used: '12.4 GB', backedUp: 5, downloaded: 2, totalOnDevice: 15 },
    document: { used: '2.1 GB', backedUp: 24, downloaded: 45, totalOnDevice: 120 },
    desktop: { used: '8.2 GB', backedUp: 3, downloaded: 0, totalOnDevice: 12 },
    download: { used: '1.8 GB', backedUp: 10, downloaded: 120, totalOnDevice: 250 }
  }
};

const INITIAL_BACKUPS: BackupItem[] = [
  { 
    id: 'b1', name: 'Legal_Contract_v4.docx', type: 'document', size: '1.2 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 3,
  },
  { 
    id: 'b2', name: 'Thesis_Final_Draft.docx', type: 'document', size: '4.5 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 5,
  },
  { id: 'b3', name: 'Project_Proposal_2025.docx', type: 'document', size: '2.8 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 2 },
];

// Storage keys
const AUTH_KEY = 'cloudvault_auth_email';
const USERS_KEY = 'cloudvault_users';

class MockApiService {
  private wait() {
    return new Promise(resolve => setTimeout(resolve, DELAY));
  }

  private getAllUsers(): Record<string, User> {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private saveUsers(users: Record<string, User>) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getUserDataKey(email: string, type: 'settings' | 'backups' | 'stats' | 'profile') {
    return `cloudvault_data_${email}_${type}`;
  }

  private async saveToFirebase(email: string, type: string, data: any) {
    if (!isFirebaseEnabled) return;
    try {
      const sanitizedEmail = email.replace(/[.@]/g, '_');
      await set(ref(database, `users/${sanitizedEmail}/${type}`), data);
    } catch (error) {
      console.warn('Firebase sync failed:', error);
    }
  }

  async login(email: string): Promise<User> {
    await this.wait();
    const users = this.getAllUsers();
    if (users[email]) {
      localStorage.setItem(AUTH_KEY, email);
      return users[email];
    }
    throw new Error('User not found');
  }

  async register(name: string, email: string): Promise<User> {
    await this.wait();
    const users = this.getAllUsers();
    if (users[email]) throw new Error('User already exists');
    
    const newUser: User = { name, email, plan: 'Free' };
    users[email] = newUser;
    this.saveUsers(users);
    
    // Initialize default data for new user
    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(INITIAL_STATS));
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(INITIAL_BACKUPS));
    
    localStorage.setItem(AUTH_KEY, email);
    
    // Initial sync to Firebase
    await this.saveToFirebase(email, 'profile', newUser);
    await this.saveToFirebase(email, 'settings', DEFAULT_SETTINGS);
    await this.saveToFirebase(email, 'stats', INITIAL_STATS);
    await this.saveToFirebase(email, 'backups', INITIAL_BACKUPS);
    
    return newUser;
  }

  async logout() {
    localStorage.removeItem(AUTH_KEY);
  }

  async getDashboardData() {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const settingsRaw = localStorage.getItem(this.getUserDataKey(email, 'settings'));
    const statsRaw = localStorage.getItem(this.getUserDataKey(email, 'stats'));
    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));

    const settings: UserSettings = settingsRaw ? JSON.parse(settingsRaw) : DEFAULT_SETTINGS;
    const stats: StorageStats = statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS;
    const backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : INITIAL_BACKUPS;

    return {
      settings,
      stats,
      recentBackups: backups,
    };
  }

  async updateSettings(settings: UserSettings) {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(settings));
    await this.saveToFirebase(email, 'settings', settings);
  }

  async createBackup(name: string, size: number, url?: string): Promise<BackupItem> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    const backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];

    const statsRaw = localStorage.getItem(this.getUserDataKey(email, 'stats'));
    const stats: StorageStats = statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS;

    const sizeGB = size / (1024 * 1024 * 1024);
    let type: any = 'other';
    const n = name.toLowerCase();
    if (n.endsWith('.pdf') || n.endsWith('.docx') || n.endsWith('.xlsx')) type = 'document';
    if (n.endsWith('.mp4') || n.endsWith('.mov')) type = 'video';
    if (n.endsWith('.png') || n.endsWith('.jpg')) type = 'image';
    
    const newBackup: BackupItem = {
      id: Math.random().toString(36).substring(7),
      name,
      type,
      size: sizeGB < 0.01 ? (size / (1024 * 1024)).toFixed(2) + ' MB' : sizeGB.toFixed(2) + ' GB',
      lastBackup: new Date().toISOString(),
      status: 'completed',
      versions: 1,
      url: url || undefined
    };

    backups.unshift(newBackup);
    stats.used = parseFloat((stats.used + sizeGB).toFixed(2));
    stats.backupCount += 1;
    stats.lastBackup = new Date().toLocaleString();

    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(stats));

    await this.saveToFirebase(email, 'backups', backups);
    await this.saveToFirebase(email, 'stats', stats);

    return newBackup;
  }

  async restoreBackup(id: string) {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    let backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];

    backups = backups.map(b => 
      b.id === id ? { ...b, isRestored: true, restoredAt: new Date().toISOString() } : b
    );

    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
    await this.saveToFirebase(email, 'backups', backups);
  }

  async deleteBackup(id: string) {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    let backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];

    const statsRaw = localStorage.getItem(this.getUserDataKey(email, 'stats'));
    const stats: StorageStats = statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS;

    const fileToDelete = backups.find(b => b.id === id);
    if (fileToDelete) {
      let sizeGB = 0;
      if (fileToDelete.size.includes('GB')) {
        sizeGB = parseFloat(fileToDelete.size.split(' ')[0]);
      } else if (fileToDelete.size.includes('MB')) {
        sizeGB = parseFloat(fileToDelete.size.split(' ')[0]) / 1024;
      }

      backups = backups.filter(b => b.id !== id);
      stats.used = parseFloat(Math.max(0, stats.used - sizeGB).toFixed(2));
      stats.backupCount = Math.max(0, stats.backupCount - 1);

      localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
      localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(stats));

      await this.saveToFirebase(email, 'backups', backups);
      await this.saveToFirebase(email, 'stats', stats);
    }
  }

  async getSystemFiles(category: string = 'all'): Promise<BackupItem[]> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    const backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];
    const backedUpNames = new Set(backups.map(b => b.name));

    const availableSystemFiles = INITIAL_SYSTEM_FILES.filter(f => !backedUpNames.has(f.name));
    
    if (category === 'all') return [...backups, ...availableSystemFiles];
    if (category === 'live') return backups;
    
    const combined = [...backups, ...availableSystemFiles];
    if (category === 'video') return combined.filter(f => f.type === 'video');
    if (category === 'document') return combined.filter(f => f.type === 'document' || f.name.endsWith('.pdf') || f.name.endsWith('.docx'));
    if (category === 'download') return combined.filter(f => f.id.startsWith('sys') && combined.indexOf(f) > 4); // Mock downloads folder logic

    return availableSystemFiles;
  }

  async getFileVersions(id: string): Promise<BackupVersion[]> {
    await this.wait();
    return [
      { id: 'v1', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), size: '1.1 MB', hash: 'SHA256:7f...a1', node: 'Laptop Node' },
      { id: 'v2', timestamp: new Date(Date.now() - 86400000).toISOString(), size: '1.15 MB', hash: 'SHA256:3d...e2', node: 'Mobile Node' },
      { id: 'v3', timestamp: new Date().toISOString(), size: '1.2 MB', hash: 'SHA256:9a...f4', node: 'Laptop Node' }
    ].reverse();
  }

  async moveToVault(id: string, passkey: string) {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    let backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];

    backups = backups.map(b => 
      b.id === id ? { ...b, isVaulted: true, vaultPasskey: passkey, failedAttempts: 0 } : b
    );

    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
    await this.saveToFirebase(email, 'backups', backups);
  }

  async verifyVaultPasskey(id: string, passkey: string): Promise<boolean> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    let backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];
    
    const file = backups.find(b => b.id === id);
    if (!file) throw new Error('File not found');

    // Check lockout
    if (file.lockoutUntil && new Date(file.lockoutUntil) > new Date()) {
        throw new Error('Lockout active. Try after 5 minutes.');
    }

    if (file.vaultPasskey === passkey) {
        // Success: Reset attempts
        backups = backups.map(b => b.id === id ? { ...b, failedAttempts: 0, lockoutUntil: undefined } : b);
        localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
        return true;
    } else {
        // Failure: Increment attempts
        const attempts = (file.failedAttempts || 0) + 1;
        let lockout;
        if (attempts >= 3) {
            lockout = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        }
        
        backups = backups.map(b => b.id === id ? { ...b, failedAttempts: attempts, lockoutUntil: lockout } : b);
        localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
        
        if (attempts >= 3) {
            throw new Error('3 failed attempts. Try after 5 minutes.');
        }
        return false;
    }
  }

  async scanSystem() {
    await new Promise(r => setTimeout(r, 2500));
  }
}

export const mockApi = new MockApiService();
