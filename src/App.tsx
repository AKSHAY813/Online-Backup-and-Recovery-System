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
    <div className="flex min-h-screen bg-[#F8FAFC] relative overflow-hidden selection:bg-blue-200">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-grid-pattern opacity-60"></div>
         <div className="blob-1 absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-blue-400/20 to-indigo-300/20"></div>
         <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-cyan-300/10 to-blue-500/10"></div>
         <div className="blob-1 absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-blue-600/5 animation-delay-2000"></div>
      </div>
      
      <InstallBanner />
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 overflow-x-hidden pb-20 md:pb-0 relative z-10">
        <header className="bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-6 py-4 sticky top-0 z-40 shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#0052A1] to-blue-600 rounded-lg flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/30">
                   <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                   </svg>
                </div>
                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-[#0052A1] tracking-tighter uppercase italic">DOCX UPLOADER</h1>

              </div>

              <div className="hidden md:flex items-center bg-slate-100/50 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-300 rounded-2xl px-5 py-2.5 w-72 ml-8 group focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-500/10">
                <svg className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search your vault..."
                  className="bg-transparent border-none outline-none ml-3 text-sm font-medium w-full text-slate-700 placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="relative p-2.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-full transition-all group">
                <svg className="w-5 h-5 group-hover:animate-wiggle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border border-white rounded-full animate-ping"></span>
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
              </button>
              <div 
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-3 cursor-pointer group pl-2 border-l border-slate-100"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-blue-600 transition-colors">{user?.name || 'Architect'}</p>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest leading-none bg-blue-50 inline-block px-1.5 py-0.5 rounded-md">Pro Active</p>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-lg overflow-hidden ring-4 ring-transparent group-hover:ring-blue-100 group-active:scale-95 transition-all">
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0052A1&color=fff`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
