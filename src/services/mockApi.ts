const DELAY = 800;
import { database, ref, set, get, child, isFirebaseEnabled } from './firebaseConfig';

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

interface CategoryStat {
  used: string;
  backedUp: number;
  downloaded: number;
  totalOnDevice: number;
}

interface StorageStats {
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

interface BackupItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'system' | 'web';
  size: string;
  lastBackup: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  versions: number;
  url?: string;
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
  { id: 'b1', name: 'Legal_Contract_v4.docx', type: 'file', size: '1.2 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 3 },
  { id: 'b2', name: 'Thesis_Final_Draft.docx', type: 'file', size: '4.5 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 5 },
  { id: 'b3', name: 'Project_Proposal_2025.docx', type: 'file', size: '2.8 MB', lastBackup: new Date().toISOString(), status: 'completed', versions: 2 },
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

  private sanitizeEmail(email: string) {
    return email.replace(/\./g, '_').replace(/@/g, '_at_');
  }

  private async fetchFromFirebase(email: string, path: string): Promise<any | null> {
    if (!isFirebaseEnabled() || !database) return null;
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `users/${this.sanitizeEmail(email)}/${path}`));
      if (snapshot.exists()) {
        return snapshot.val();
      }
    } catch (err) {
      console.warn(`Firebase fetch failed for ${path}:`, err);
    }
    return null;
  }

  private async saveToFirebase(email: string, path: string, data: any): Promise<void> {
    if (!isFirebaseEnabled() || !database) return;
    try {
      const userRef = ref(database, `users/${this.sanitizeEmail(email)}/${path}`);
      await set(userRef, data);
    } catch (err) {
      console.warn(`Firebase save failed for ${path}:`, err);
    }
  }

  async login(email: string, password: string): Promise<User> {
    await this.wait();
    
    // First check Firebase for the user profile
    const firebaseUser = await this.fetchFromFirebase(email, 'profile');
    if (firebaseUser && firebaseUser.password === password) {
      localStorage.setItem(AUTH_KEY, email);
      // Sync locally for offline support
      const users = this.getAllUsers();
      users[email] = firebaseUser;
      this.saveUsers(users);
      const { password: _, ...userWithoutPassword } = firebaseUser;
      return userWithoutPassword;
    }

    // Fallback to local storage (existing users)
    const users = this.getAllUsers();
    const user = users[email];
    if (user && user.password === password) {
      localStorage.setItem(AUTH_KEY, email);
      const { password: _, ...userWithoutPassword } = user;
      
      // If we found them locally, sync to Firebase for future sessions on other devices
      await this.saveToFirebase(email, 'profile', user);
      
      return userWithoutPassword;
    }
    throw new Error('Invalid email or password');
  }

  async register(userData: User & { password: string }): Promise<User> {
    await this.wait();
    const users = this.getAllUsers();
    
    if (users[userData.email]) {
      throw new Error('User already exists');
    }

    users[userData.email] = userData;
    this.saveUsers(users);
    localStorage.setItem(AUTH_KEY, userData.email);
    
    // Initialize default states locally
    const email = userData.email;
    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(INITIAL_STATS));
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(INITIAL_BACKUPS));
    
    // Sync all to Firebase
    await this.saveToFirebase(email, 'profile', userData);
    await this.saveToFirebase(email, 'settings', DEFAULT_SETTINGS);
    await this.saveToFirebase(email, 'stats', INITIAL_STATS);
    await this.saveToFirebase(email, 'backups', INITIAL_BACKUPS);

    
    const { password: _, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  }

  async logout() {
    await this.wait();
    localStorage.removeItem(AUTH_KEY);
  }

  async getAuthenticatedUser(): Promise<User | null> {
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) return null;
    
    // Check locally first for speed
    const users = this.getAllUsers();
    const localUser = users[email];
    
    if (localUser) {
      const { password: _, ...userWithoutPassword } = localUser;
      return userWithoutPassword;
    }

    // Fallback to Firebase
    const firebaseUser = await this.fetchFromFirebase(email, 'profile');
    if (firebaseUser) {
        const { password: _, ...userWithoutPassword } = firebaseUser;
        return userWithoutPassword;
    }

    return null;
  }

  async updateUser(updatedUser: User): Promise<User> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const users = this.getAllUsers();
    const user = { ...users[email], ...updatedUser };
    users[email] = user;
    this.saveUsers(users);
    
    // Sync to Firebase
    await this.saveToFirebase(email, 'profile', user);
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getSettings(): Promise<UserSettings> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    // Prefer Firebase settings
    const fbSettings = await this.fetchFromFirebase(email, 'settings');
    if (fbSettings) {
      localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(fbSettings));
      return fbSettings;
    }

    const settings = localStorage.getItem(this.getUserDataKey(email, 'settings'));
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  }

  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(settings));
    
    // Sync to Firebase
    await this.saveToFirebase(email, 'settings', settings);
    
    return settings;
  }

  async getDashboardData(): Promise<{ stats: StorageStats; recentBackups: BackupItem[] }> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    // Fetch from Firebase for true cloud support
    let fbStats = await this.fetchFromFirebase(email, 'stats');
    let fbBackups = await this.fetchFromFirebase(email, 'backups');

    // Convert firebase object back to array if it was stored as an object (Firebase sometimes does this with indexed arrays)
    if (fbBackups && typeof fbBackups === 'object' && !Array.isArray(fbBackups)) {
        fbBackups = Object.values(fbBackups).sort((a: any, b: any) => 
            new Date(b.lastBackup).getTime() - new Date(a.lastBackup).getTime()
        );
    }

    const stats = fbStats || JSON.parse(localStorage.getItem(this.getUserDataKey(email, 'stats')) || JSON.stringify(INITIAL_STATS));
    const backups = fbBackups || JSON.parse(localStorage.getItem(this.getUserDataKey(email, 'backups')) || JSON.stringify(INITIAL_BACKUPS));

    // Dynamic storage total allocation based on settings
    const settingsRaw = localStorage.getItem(this.getUserDataKey(email, 'settings'));
    if (settingsRaw) {
      const parsedSettings = JSON.parse(settingsRaw);
      if (parsedSettings.totalStorage) {
        stats.total = parsedSettings.totalStorage;
      }
    }

    // Cache to local storage
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(stats));
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));

    return {
      stats,
      recentBackups: backups,
    };
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
    let type: 'file' | 'folder' | 'system' | 'web' = name.includes('.') ? 'file' : 'folder';
    if (url) type = 'web';
    
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

    // Save locally
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(stats));

    // Sync to Firebase
    await this.saveToFirebase(email, 'backups', backups);
    await this.saveToFirebase(email, 'stats', stats);

    return newBackup;
  }
}

export const mockApi = new MockApiService();

