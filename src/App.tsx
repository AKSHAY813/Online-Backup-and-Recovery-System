import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Backup } from '@/components/Backup';
import { Recovery } from '@/components/Recovery';
import { Schedule } from '@/components/Schedule';
import { Settings } from '@/components/Settings';
import { ProfileModal } from '@/components/ProfileModal';
import { Login } from '@/components/Login';
import { mockApi } from '@/services/mockApi';
import { useEffect } from 'react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = await mockApi.getAuthenticatedUser();
        if (authUser) {
          setUser(authUser);
          setIsAuthenticated(true);
          const settingsData = await mockApi.getSettings();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = async (loggedInUser: any) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setIsLoading(true);
    try {
      const settingsData = await mockApi.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to fetch settings after login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await mockApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      setSettings(null);
      setActiveTab('dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (updatedUser: typeof user) => {
    setIsLoading(true);
    try {
      const data = await mockApi.updateUser(updatedUser);
      setUser(data);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async (updatedSettings: typeof settings) => {
    setIsLoading(true);
    try {
      const data = await mockApi.updateSettings(updatedSettings);
      setSettings(data);
    } catch (error) {
      console.error('Failed to update settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'backup':
        return <Backup />;
      case 'recovery':
        return <Recovery />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings user={user} settings={settings} onSave={handleUpdateSettings} onLogout={handleLogout} />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated && !isLoading) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search files, backups..."
                  className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-green-700">All Systems Operational</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer hover:bg-slate-50 transition-all rounded-xl py-1 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '??'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-cyan-600 transition-colors">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.plan}</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>© 2025 CloudVault. Secure Backup & Recovery System.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-cyan-600 transition-colors">Documentation</a>
              <a href="#" className="hover:text-cyan-600 transition-colors">Support</a>
              <a href="#" className="hover:text-cyan-600 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </main>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user}
        onSave={handleUpdateUser}
      />

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600">Syncing with CloudVault...</p>
          </div>
        </div>
      )}
    </div>
  );
}
