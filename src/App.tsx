import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Backup } from '@/components/Backup';
import { Recovery } from '@/components/Recovery';
import { Schedule } from '@/components/Schedule';
import { Settings } from '@/components/Settings';
import { ProfileModal } from '@/components/ProfileModal';
import { Auth } from '@/components/Auth';
import { InstallBanner } from '@/components/InstallBanner';
import { BottomNav } from '@/components/BottomNav';
import { mockApi } from '@/services/mockApi';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync state from localStorage immediately to prevent "blank" auth states
  useEffect(() => {
    const storedUser = localStorage.getItem('cloudvault_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Synchronize mockApi auth key
      if (!localStorage.getItem('cloudvault_auth_email')) {
        localStorage.setItem('cloudvault_auth_email', parsedUser.email);
      }
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('cloudvault_user');
      if (storedUser) {
        // Already handled in first useEffect for speed
        setIsLoading(false);
        mockApi.getSettings().then(data => setSettings(data)).catch(err => console.error(err));
      } else {
        const authUser = await mockApi.getAuthenticatedUser();
        if (authUser) {
          setUser(authUser);
          setIsAuthenticated(true);
          const settingsData = await mockApi.getSettings();
          setSettings(settingsData);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsLoading(true);
      import('@/services/huggingFaceAuth').then(async m => {
        try {
          const user = await m.handleHFCallback(code);
          handleLoginSuccess(user);
        } catch (error) {
          console.error('OAuth failed:', error);
          showToast('Failed to authenticate via Hugging Face', 'error');
        } finally {
          setIsLoading(false);
        }
      });
    } else {
      checkAuth();
    }
  }, []);


  const handleLoginSuccess = async (loggedInUser: any) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setIsSyncing(true);
    try {
      const settingsData = await mockApi.getSettings();
      setSettings(settingsData);
      showToast('Welcome back, ' + loggedInUser.name, 'info');
    } catch (error) {
      console.error('Failed to fetch settings after login:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    setIsSyncing(true);
    try {
      await mockApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      setSettings(null);
      setActiveTab('dashboard');
      showToast('Log out successful', 'info');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateUser = async (updatedUser: typeof user) => {
    setIsSyncing(true);
    try {
      const data = await mockApi.updateUser(updatedUser);
      setUser(data);
      showToast('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update user:', error);
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateSettings = async (updatedSettings: typeof settings) => {
    setIsSyncing(true);
    try {
      const data = await mockApi.updateSettings(updatedSettings);
      setSettings(data);
      showToast('Settings saved', 'success');
    } catch (error) {
      console.error('Failed to update settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSyncing(false);
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

  // If NOT authenticated and finished loading, show Auth
  if (!isLoading && !isAuthenticated) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  // If loading and we DON'T have user info yet, show the minimal splash
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-[#0052A1] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 animate-bounce">
           <svg className="w-full h-full text-[#0052A1]" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
           </svg>
        </div>
      </div>
    );
  }

  // App Shell First: Always render the structure if we have user context
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative">
      <InstallBanner />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0">
        <header className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0052A1] rounded-lg flex items-center justify-center p-1.5 shadow-md">
                   <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vault</h1>
              </div>

              <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-4 py-2 w-64 ml-4">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your vault..."
                  className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-600 placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{user?.name || 'Architect'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Pro Plan Active</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-200 border-2 border-white shadow-lg overflow-hidden ring-4 ring-blue-50/50 group-active:scale-95 transition-all">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0052A1&color=fff`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
          <div className="animate-slide-up">
            {renderContent()}
          </div>
        </div>

        {/* Global Floating Notification (Toast) */}
        {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-full duration-700">
            <div className={`px-8 py-4 rounded-[1.5rem] shadow-2xl flex items-center gap-4 border backdrop-blur-2xl ${
              toast.type === 'success' ? 'bg-emerald-600/90 border-emerald-400/50 text-white' :
              toast.type === 'error' ? 'bg-rose-600/90 border-rose-400/50 text-white' :
              'bg-slate-900/95 border-slate-700 text-white'
            }`}>
              {toast.type === 'success' && (
                <div className="bg-white/20 p-1.5 rounded-xl shadow-inner">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <span className="font-extrabold text-sm tracking-tight">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="px-10 py-12 border-t border-slate-100 bg-white/40 backdrop-blur-sm mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
              <p>© 2025 SENTINEL BLUE • QUANTUM CRYPTOGRAPHIC PROTOCOL</p>
            </div>
            <div className="flex items-center gap-10">
              <a href="#" className="hover:text-blue-600 transition-all hover:tracking-[0.3em]">Neural Nodes</a>
              <a href="#" className="hover:text-blue-600 transition-all hover:tracking-[0.3em]">API SDK</a>
              <a href="#" className="hover:text-blue-600 transition-all hover:tracking-[0.3em]">Compliance</a>
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

      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-500">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 border border-slate-100 max-w-sm w-full mx-6">
            <div className="relative">
              <div className="w-20 h-20 border-[6px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600/10 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">Syncing Shards</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Connecting to CloudVault Hub</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
