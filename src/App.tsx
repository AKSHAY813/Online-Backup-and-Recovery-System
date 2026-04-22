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

  useEffect(() => {
    const storedUser = localStorage.getItem('cloudvault_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
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
      case 'dashboard': return <Dashboard />;
      case 'backup': return <Backup />;
      case 'recovery': return <Recovery />;
      case 'schedule': return <Schedule />;
      case 'settings': return <Settings user={user} settings={settings} onSave={handleUpdateSettings} onLogout={handleLogout} />;
      default: return <Dashboard />;
    }
  };

  if (!isLoading && !isAuthenticated) {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 animate-neural-pulse blur-[100px]"></div>
        <div className="relative group">
           <div className="absolute inset-0 bg-blue-600 blur-[30px] opacity-40 animate-pulse"></div>
           <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center p-5 animate-bounce backdrop-blur-3xl border border-white/10 relative z-10">
              <svg className="w-full h-full text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
           </div>
        </div>
        <div className="text-center">
            <h2 className="text-3xl font-black text-white tracking-widest uppercase italic">VAULT</h2>
            <p className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.5em] mt-3">Initializing Neural Mesh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-hidden selection:bg-blue-600 selection:text-white">
      <div className="scanline"></div>
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="blob-1 absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-600/5 blur-[120px]"></div>
          <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-indigo-600/5 blur-[120px]"></div>
      </div>
      
      <InstallBanner />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-x-hidden pb-32 md:pb-0 relative z-10 w-full">
        {/* Superior Header Relay */}
        <header className="bg-white/70 backdrop-blur-3xl border-b border-slate-100/30 px-6 py-6 sticky top-0 z-40">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center p-2 shadow-2xl shadow-blue-600/20">
                   <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                </div>
                <div>
                   <h1 className="text-xl font-black text-slate-900 tracking-[-0.05em] uppercase leading-none italic">VAULT</h1>
                   <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">v4.2 DEPLOYED</p>
                </div>
              </div>

              <div className="hidden lg:flex items-center bg-slate-100/50 border border-slate-100 transition-all rounded-3xl px-8 py-4 w-96 ml-10 group focus-within:bg-white focus-within:border-blue-400 focus-within:ring-8 focus-within:ring-blue-100/30">
                <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Locate Shard..." className="bg-transparent border-none outline-none ml-4 text-sm font-extrabold w-full text-slate-900 placeholder:text-slate-300 uppercase tracking-tight" />
              </div>
            </div>
            
            <div className="flex items-center gap-6 md:gap-10">
              <button className="relative p-3 text-slate-400 hover:text-blue-600 bg-slate-50 border border-slate-100 rounded-2xl transition-all group">
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-ping"></span>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
              </button>
              <div onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-4 cursor-pointer group active:scale-95 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors uppercase">{user?.name || 'ARCHITECT'}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">PRO NODE</p>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[1.5rem] bg-white border border-slate-200 shadow-2xl overflow-hidden p-1 group-hover:border-blue-400 transition-all">
                  <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'S'}&background=0052A1&color=fff`} className="w-full h-full object-cover rounded-[1.2rem]" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Global Content Deployment */}
        <div className="p-6 md:p-14 max-w-7xl mx-auto min-h-[calc(100vh-300px)]">
           {renderContent()}
        </div>

        {/* Global Shard Alerts (Toasts) */}
        {toast && (
          <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
            <div className={`px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border backdrop-blur-3xl ${
              toast.type === 'success' ? 'bg-emerald-600/90 border-emerald-400/50 text-white' :
              toast.type === 'error' ? 'bg-rose-600/90 border-rose-400/50 text-white' :
              'bg-slate-900/95 border-slate-700 text-white shadow-blue-500/10'
            }`}>
              <span className="font-black text-base tracking-tight uppercase">{toast.message}</span>
            </div>
          </div>
        )}

        <footer className="px-10 py-16 border-t border-slate-50 bg-white/40 backdrop-blur-xl mt-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] text-center">
            <p>© 2026 VAULT BLUE • NEURAL SYNC VERIFIED • AES-256</p>
            <div className="flex items-center gap-12 opacity-50">
               <span className="hover:text-blue-600 transition-all cursor-pointer">Protocol</span>
               <span className="hover:text-blue-600 transition-all cursor-pointer">Shards</span>
               <span className="hover:text-blue-600 transition-all cursor-pointer">Security</span>
            </div>
          </div>
        </footer>
      </main>

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={user} onSave={handleUpdateUser} />

      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-2xl flex items-center justify-center animate-fade-in">
          <div className="bg-white p-14 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center gap-10 border border-slate-100 max-w-md w-full mx-10">
            <div className="w-24 h-24 border-[8px] border-slate-50 border-t-blue-600 rounded-full animate-spin shadow-inner"></div>
            <div className="text-center">
              <p className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-3">Syncing Mesh</p>
              <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] uppercase">Relaying Shards to Hub</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
