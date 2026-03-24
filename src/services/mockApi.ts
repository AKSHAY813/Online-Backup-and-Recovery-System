const DELAY = 800;

interface User {
  name: string;
  email: string;
  plan: string;
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
}

interface StorageStats {
  used: number;
  total: number;
  backupCount: number;
  lastBackup: string;
}

interface BackupItem {
  id: string;
  name: string;
  type: 'file' | 'folder' | 'system';
  size: string;
  lastBackup: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
  versions: number;
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
};

const INITIAL_STATS: StorageStats = {
  used: 0,
  total: 500,
  backupCount: 0,
  lastBackup: 'Never',
};

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

  private getUserDataKey(email: string, type: 'settings' | 'backups' | 'stats' | 'recovery') {
    return `cloudvault_data_${email}_${type}`;
  }

  async login(email: string, password: string): Promise<User> {
    await this.wait();
    const users = this.getAllUsers();
    const user = users[email];
    
    if (user && user.password === password) {
      localStorage.setItem(AUTH_KEY, email);
      const { password: _, ...userWithoutPassword } = user;
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
    
    // Initialize default states for new user
    const email = userData.email;
    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(INITIAL_STATS));
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify([]));
    localStorage.setItem(this.getUserDataKey(email, 'recovery'), JSON.stringify([]));
    
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
    
    const users = this.getAllUsers();
    const user = users[email];
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async getUser(): Promise<User> {
    await this.wait();
    const user = await this.getAuthenticatedUser();
    if (!user) throw new Error('Not authenticated');
    return user;
  }

  async updateUser(updatedUser: User): Promise<User> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const users = this.getAllUsers();
    users[email] = { ...users[email], ...updatedUser };
    this.saveUsers(users);
    
    const { password: _, ...userWithoutPassword } = users[email];
    return userWithoutPassword;
  }

  async changePassword(newPassword: string): Promise<void> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const users = this.getAllUsers();
    users[email].password = newPassword;
    this.saveUsers(users);
  }

  async getSettings(): Promise<UserSettings> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const settings = localStorage.getItem(this.getUserDataKey(email, 'settings'));
    return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
  }

  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    localStorage.setItem(this.getUserDataKey(email, 'settings'), JSON.stringify(settings));
    return settings;
  }

  // Dashboard & Recovery Data Methods
  async getDashboardData(): Promise<{ stats: StorageStats; recentBackups: BackupItem[] }> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const statsRaw = localStorage.getItem(this.getUserDataKey(email, 'stats'));
    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));

    return {
      stats: statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS,
      recentBackups: backupsRaw ? JSON.parse(backupsRaw) : [],
    };
  }

  async createBackup(name: string, size: number): Promise<BackupItem> {
    await this.wait();
    const email = localStorage.getItem(AUTH_KEY);
    if (!email) throw new Error('Not authenticated');

    const backupsRaw = localStorage.getItem(this.getUserDataKey(email, 'backups'));
    const backups: BackupItem[] = backupsRaw ? JSON.parse(backupsRaw) : [];

    const statsRaw = localStorage.getItem(this.getUserDataKey(email, 'stats'));
    const stats: StorageStats = statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS;

    const sizeGB = size / (1024 * 1024 * 1024);
    
    const newBackup: BackupItem = {
      id: Math.random().toString(36).substring(7),
      name,
      type: name.includes('.') ? 'file' : 'folder',
      size: sizeGB < 0.01 ? (size / (1024 * 1024)).toFixed(2) + ' MB' : sizeGB.toFixed(2) + ' GB',
      lastBackup: new Date().toISOString(),
      status: 'completed',
      versions: 1
    };

    backups.unshift(newBackup);
    localStorage.setItem(this.getUserDataKey(email, 'backups'), JSON.stringify(backups));

    // Update stats
    stats.used = parseFloat((stats.used + sizeGB).toFixed(2));
    stats.backupCount += 1;
    stats.lastBackup = new Date().toLocaleString();
    localStorage.setItem(this.getUserDataKey(email, 'stats'), JSON.stringify(stats));

    return newBackup;
  }
}

export const mockApi = new MockApiService();
