import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true;

    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => setShowBanner(false);

  if (isInstalled) {
    setTimeout(() => setIsInstalled(false), 4000);
    return (
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
        <div className="bg-emerald-600 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-emerald-500/50 backdrop-blur-xl">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-black text-xs uppercase tracking-widest">Protocol Success</p>
            <p className="text-sm font-bold opacity-90">Sentinel Node Deployed Successfully</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 z-[199] bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500" onClick={handleDismiss} />

      <div className="fixed inset-0 z-[200] flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden animate-slide-up border border-white/50">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 rotate-45"></div>
            
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center shadow-2xl ring-1 ring-white/20">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-white mb-1 tracking-tighter uppercase">CloudVault</h2>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em]">Sentinel Infrastructure</p>
          </div>

          <div className="p-10">
            <div className="text-center mb-10">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-3">Install Node</h3>
              <p className="text-slate-400 text-xs font-bold leading-relaxed px-4">
                Integrate Sentinel OS directly into your environment for maximum shard throughput and offline restoration.
              </p>
            </div>

            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full py-6 bg-[#0052A1] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {isInstalling ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Deploy to Device</span>
                </>
              )}
            </button>

            <button
              onClick={handleDismiss}
              className="w-full py-4 mt-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-500 transition-colors"
            >
              Skip Integration
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
