import { useState } from 'react';

interface SettingsProps {
  user: any;
  settings: any;
  onSave: (settings: any) => void;
  onLogout: () => void;
}

export function Settings({ user, settings, onSave, onLogout }: SettingsProps) {
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [isHistoryUnlocked, setIsHistoryUnlocked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingStorage, setPendingStorage] = useState<{label: string, value: number} | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '1234') {
      setIsHistoryUnlocked(true);
      setShowError(false);
    } else {
      setShowError(true);
      setPasscode('');
    }
  };

  const renderSubView = () => {
    switch (activeSubView) {
      case 'Access History':
        if (!isHistoryUnlocked) {
          return (
            <div className="sentinel-card p-10 bg-slate-900 text-white animate-slide-up">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                  <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-2 uppercase">Security Clearance</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Enter node authorization code to audit logs</p>
              </div>
              <form onSubmit={handlePasscodeSubmit} className="max-w-xs mx-auto">
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  className={`w-full bg-white/5 border ${showError ? 'border-rose-500' : 'border-white/10'} rounded-2xl px-6 py-4 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-blue-500 transition-all mb-4`}
                  maxLength={4}
                />
                {showError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center mb-4">Invalid Clearance Pattern</p>}
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all">Verify Node Access</button>
              </form>
            </div>
          );
        }
        return (
          <div className="sentinel-card p-10 bg-white animate-slide-up">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase">Neural Access Logs</h3>
            <div className="space-y-4">
              {[
                { event: 'Shard Restored', file: 'Project_Alpha.zip', node: 'iPhone Uplink', time: '2m ago' },
                { event: 'Sync Verified', file: 'Design_System.fig', node: 'Laptop Node', time: '15m ago' },
                { event: 'Uplink Established', file: 'System OS', node: 'Encrypted Proxy', time: '1h ago' },
                { event: 'Category Scanned', file: 'Media Library', node: 'Local Storage', time: '2h ago' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={i % 2 === 0 ? "M5 13l4 4L19 7" : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"} /></svg>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1.5 uppercase">{log.event}</p>
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{log.file}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{log.node}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsHistoryUnlocked(false)} className="mt-8 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all">Lock Audit Logs</button>
          </div>
        );

      case 'System Updates':
        return (
          <div className="sentinel-card p-10 bg-emerald-50 border border-emerald-100 animate-slide-up">
            <div className="flex items-center gap-6 mb-8 text-emerald-600">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight uppercase">System Updated</h3>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status: Fully Operational</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-[2rem] border border-emerald-200/50">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Build Identifier</p>
                 <p className="text-lg font-black text-slate-900 tracking-tight">SENTINEL-X-4.0.1-STABLE-OUTFIT</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-emerald-200/50">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Patch Date</p>
                 <p className="text-lg font-black text-slate-900 tracking-tight">April 02, 2026 • 22:32:00</p>
              </div>
            </div>
            <button onClick={() => setActiveSubView(null)} className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Return to Settings</button>
          </div>
        );

      case 'Vault Allocation': {
        const storageOptions = [
          { label: '256 GB', value: 256 },
          { label: '512 GB', value: 512 },
          { label: '1 TB', value: 1024 },
          { label: '2 TB', value: 2048 }
        ];
        
        return (
          <div className="sentinel-card p-10 bg-white animate-slide-up">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 uppercase">Vault Capacity</h3>
            <div className="space-y-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                 Select your decentralized shard cluster capacity. Your vault uses strict 1-to-1 node pairing: only a single email terminal corresponds to a single storage vault. To access an alternative mail storage, you must explicitly detach and re-authenticate.
               </p>
               <div className="grid grid-cols-2 gap-4">
                  {storageOptions.map((opt) => {
                    const isSelected = settings?.totalStorage === opt.value;
                    return (
                      <button 
                        key={opt.value}
                        onClick={() => {
                          if (opt.value > (settings?.totalStorage || 0)) {
                             setPendingStorage(opt);
                             setShowPaymentModal(true);
                          } else {
                             const newSettings = { ...settings, totalStorage: opt.value };
                             onSave(newSettings);
                          }
                        }}
                        className={`p-6 border-2 rounded-[1.5rem] transition-all text-center ${isSelected ? 'border-[#0052A1] bg-blue-50 shadow-lg shadow-blue-500/20 scale-[1.02] z-10' : 'border-slate-100 hover:border-blue-200'}`}
                      >
                         <p className={`text-2xl font-black ${isSelected ? 'text-[#0052A1]' : 'text-slate-900'} tracking-tighter`}>{opt.label}</p>
                         <p className={`text-[10px] uppercase font-bold tracking-widest mt-2 ${isSelected ? 'text-blue-500' : 'text-slate-400'}`}>
                           {isSelected ? 'Active Cluster' : (opt.value > (settings?.totalStorage || 0) ? 'Upgrade Node' : 'Allocate Node')}
                         </p>
                      </button>
                    )
                  })}
               </div>
            </div>
            <button onClick={() => setActiveSubView(null)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest transition-all">Close Allocation View</button>
          </div>
        );
      }

      case 'Help Terminal':
        return (
          <div className="sentinel-card p-0 bg-slate-900 text-emerald-400 font-mono overflow-hidden animate-slide-up shadow-2xl border-2 border-slate-800">
            <div className="bg-slate-800 px-6 py-3 flex items-center justify-between">
               <div className="flex gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
               </div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sentinel Terminal v1.0</p>
            </div>
            <div className="p-8 text-xs leading-relaxed max-h-[400px] overflow-y-auto">
               <p className="mb-2 text-white/40"># Initialize Uplink Protocols...</p>
               <p className="mb-2"><span className="text-white">root@sentinel:~#</span> user_audit --active</p>
               <p className="mb-2 text-emerald-600">{'>>'} Current User: {user?.name || 'Architect'}</p>
               <p className="mb-2 text-emerald-600">{'>>'} Total Nodes: 3 Active, 1 Standby</p>
               <p className="mb-2 text-emerald-600">{'>>'} Shard Status: VERIFIED (12/12)</p>
               <p className="mb-2"><span className="text-white">root@sentinel:~#</span> fetch system_health --all</p>
               <p className="mb-2 text-blue-400">[CORE] CPU: 12% - RAM: 4.2GB/16GB</p>
               <p className="mb-2 text-blue-400">[STORAGE] Vault Load: 24.5 GB Used</p>
               <p className="mb-2 text-blue-400">[NETWORK] Latency: 12ms (Target: Global-1)</p>
               <p className="mb-2"><span className="text-white">root@sentinel:~#</span> <span className="animate-pulse">_</span></p>
            </div>
            <div className="p-4 bg-slate-800/50 border-t border-white/5 flex gap-4">
               <button onClick={() => setActiveSubView(null)} className="px-6 py-2 bg-slate-700 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-600 transition-colors">Exit Bash</button>
               <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Clear Logs</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 animate-slide-up max-w-3xl mx-auto pb-20 font-['Outfit']">
      {!activeSubView ? (
        <>
          {/* Profile Identity Card */}
          <div className="sentinel-card p-10 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 rounded-[3rem] p-1 backdrop-blur-md ring-4 ring-white/10">
                  <div className="w-full h-full bg-blue-600 rounded-[2.8rem] flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'S'
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-xl">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase">{user?.name || 'Sentinel'}</h2>
                  <span className="bg-blue-500 text-[10px] text-white font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">
                    {user?.plan || 'Standard Node'}
                  </span>
                </div>
                <p className="text-slate-400 font-bold text-sm tracking-widest uppercase mb-6">{user?.email || 'unreachable@cloudvault.node'}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Uptime</p>
                    <p className="text-xs font-black tracking-widest">99.99%</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Encryption</p>
                    <p className="text-xs font-black tracking-widest">AES-256</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Security Core', icon: 'shield', desc: 'Manage biometric keys and 2FA protocols' },
              { label: 'Neural Sync', icon: 'refresh', desc: 'Configure real-time restoration buffers' },
              { label: 'Vault Allocation', icon: 'database', desc: 'Expand cloud shard capacity' },
              { label: 'Access History', icon: 'clock', desc: 'Audit node entry and exit logs' },
              { label: 'System Updates', icon: 'cpu', desc: 'Status: Updated v4.0.1 Stable' },
              { label: 'Help Terminal', icon: 'help', desc: 'Access global support bash node' }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSubView(item.label)}
                className="sentinel-card p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl group transition-all text-left"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 transform group-hover:rotate-6">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                      {item.icon === 'refresh' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                      {item.icon === 'database' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                      {item.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {item.icon === 'cpu' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2-2v10a2 2 0 002 2zM9 9h6v6H9V9z" />}
                      {item.icon === 'help' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 tracking-tighter uppercase mb-0.5">{item.label}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Dangerous Operations */}
          <div className="pt-6">
            <button 
              onClick={onLogout}
              className="w-full sentinel-card p-6 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-black text-rose-600 tracking-tighter uppercase mb-0.5">Disconnect Node</h4>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none">Terminate active session shard</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={() => setActiveSubView(null)}
            className="flex items-center gap-3 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-all mb-4 px-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Primary Node Settings
          </button>
          {renderSubView()}
        </div>
      )}

      {showPaymentModal && pendingStorage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-slide-up border border-slate-100 p-8">
            {paymentSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful!</h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 px-4">Node capacity extended to {pendingStorage.label}</p>
                <button 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }}
                  className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest w-full"
                >
                  Return to Settings
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Upgrade Node Capacity</h3>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-8">Extend vault to {pendingStorage.label}</p>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                      <p className="text-2xl font-black text-slate-900">${pendingStorage.value === 512 ? '4.99' : pendingStorage.value === 1024 ? '9.99' : '19.99'} <span className="text-sm font-bold text-slate-400">/mo</span></p>
                   </div>
                   <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-blue-100 flex items-center justify-between mt-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                         <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.97-1.3-3.15-3.01-3.55V6h-1.3v2.04c-1.54.23-2.73 1.39-2.73 2.92 0 1.94 1.5 2.7 3.41 3.14 1.99.47 2.34 1.15 2.34 1.84 0 .71-.58 1.48-2.2 1.48-1.57 0-2.34-.84-2.43-1.89h-1.76c.12 1.88 1.38 2.97 3.09 3.33V21h1.3v-2.02c1.68-.24 2.85-1.45 2.85-3.05 0-2.35-1.83-3.02-3.27-3.37z"/></svg>
                      </div>
                      <div>
                         <p className="font-black tracking-tight text-sm text-slate-800">Razorpay Secured</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Real-time Encrypted Processing</p>
                      </div>
                   </div>
                </div>

                <div className="mt-8 flex gap-3 flex-col-reverse md:flex-row">
                  <button onClick={() => setShowPaymentModal(false)} className="px-6 py-4 border border-slate-200 text-slate-600 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-slate-50 w-full md:w-auto transition-all">Cancel</button>
                  <button 
                    onClick={async () => {
                       setIsProcessingPayment(true);
                       
                       // Dynamically load Razorpay SDK
                       const res = await new Promise((resolve) => {
                          const script = document.createElement('script');
                          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                          script.onload = () => resolve(true);
                          script.onerror = () => resolve(false);
                          document.body.appendChild(script);
                       });

                       if (!res) {
                          alert('Razorpay SDK failed to load. Are you online?');
                          setIsProcessingPayment(false);
                          return;
                       }

                       // Setup payment options securely
                       const options = {
                           key: 'rzp_test_placeholder_key', // This is a placeholder test key. Connect your real key here!
                           amount: (pendingStorage.value === 512 ? 499 : pendingStorage.value === 1024 ? 999 : 1999) * 100, // Amount in paise
                           currency: 'INR',
                           name: 'CloudVault',
                           description: `Upgrade to ${pendingStorage.label} Node Capacity`,
                           image: 'https://ui-avatars.com/api/?name=Cloud+Vault&background=0052A1&color=fff',
                           handler: function (response: any) {
                              // Execute successful capacity mapping after verifiable payment
                              setPaymentSuccess(true);
                              onSave({ ...settings, totalStorage: pendingStorage.value });
                           },
                           prefill: {
                               name: user?.name || 'Architect User',
                               email: user?.email || 'architect@cloudvault.sh',
                           },
                           theme: {
                               color: '#0052A1'
                           },
                           modal: {
                               ondismiss: function() {
                                   setIsProcessingPayment(false);
                               }
                           }
                       };

                       const paymentObject = new (window as any).Razorpay(options);
                       paymentObject.open();
                    }}
                    disabled={isProcessingPayment}
                    className="flex-1 px-6 py-4 bg-[#0052A1] text-white rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-blue-800 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
                  >
                    {isProcessingPayment ? 'Connecting Gateway...' : `Pay & Upgrade Node (${pendingStorage.label})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sentinel OS v4.0.1 Stable Cluster</p>
      </div>
    </div>
  );
}
