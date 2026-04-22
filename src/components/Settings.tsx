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
            <div className="glass-dark rounded-[2.5rem] p-10 md:p-14 text-white animate-slide-up shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="text-center mb-10 relative z-10">
                <div className="w-24 h-24 bg-blue-600/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 uppercase">Neural Clearance</h3>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Authorize Node Audit Protocols</p>
              </div>
              <form onSubmit={handlePasscodeSubmit} className="max-w-xs mx-auto relative z-10">
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                  className={`w-full bg-white/5 border ${showError ? 'border-rose-500' : 'border-white/10'} rounded-3xl px-8 py-6 text-center text-4xl font-black tracking-[0.6em] outline-none focus:border-blue-500 transition-all mb-6`}
                  maxLength={4}
                />
                {showError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center mb-6">Invalid Encryption Key</p>}
                <button type="submit" className="btn-neural btn-neural-primary w-full py-5 text-sm uppercase">Verify Access</button>
              </form>
            </div>
          );
        }
        return (
          <div className="Vault-card p-8 md:p-14 bg-white animate-slide-up">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-10 uppercase">Access Records</h3>
            <div className="space-y-4">
              {[
                { event: 'Shard Restored', file: 'Project_Alpha.zip', node: 'iPhone Uplink', time: '2m ago' },
                { event: 'Sync Verified', file: 'Design_System.fig', node: 'Laptop Node', time: '15m ago' },
                { event: 'Uplink Established', file: 'System OS', node: 'Encrypted Proxy', time: '1h ago' },
                { event: 'Category Scanned', file: 'Media Library', node: 'Local Storage', time: '2h ago' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-50">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={i % 2 === 0 ? "M5 13l4 4L19 7" : "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"} /></svg>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-base tracking-tight leading-none mb-2 uppercase">{log.event}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{log.file}</span>
                         <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{log.node}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsHistoryUnlocked(false)} className="mt-10 w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:border-blue-500 hover:text-blue-600 transition-all">Lock Audit Logs</button>
          </div>
        );

      case 'System Updates':
        return (
          <div className="Vault-card p-10 md:p-14 bg-emerald-50 border border-emerald-100 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-[100px] -mr-40 -mt-40"></div>
            <div className="flex flex-col md:flex-row items-center gap-10 mb-12 text-emerald-600 relative z-10">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/10 border border-emerald-100">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">Node Optimized</h3>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">Status: Peak Operation</p>
              </div>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-200/50 shadow-sm">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">Core Build</p>
                 <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">Vault X-4.0 Stable</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-200/50 shadow-sm">
                 <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-3">Last Patch</p>
                 <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase">April 17, 2026 • 05:45</p>
              </div>
            </div>
            <button onClick={() => setActiveSubView(null)} className="btn-neural bg-emerald-600 text-white hover:bg-emerald-700 w-full mt-10 shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-xs">Acknowledge Update</button>
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
          <div className="Vault-card p-10 md:p-14 bg-white animate-slide-up">
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter mb-10 uppercase">Node Expansion</h3>
            <div className="space-y-10">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] leading-relaxed max-w-lg">
                 Extend your decentralized shard cluster. Vault uses strict <span className="text-blue-600">1-to-1 node pairing</span> across all mesh relays.
               </p>
               <div className="grid grid-cols-2 gap-6">
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
                        className={`p-10 border-4 rounded-[2.5rem] transition-all text-center relative overflow-hidden group/opt ${isSelected ? 'border-blue-600 bg-blue-50 shadow-2xl shadow-blue-500/10' : 'border-slate-100 hover:border-blue-100'}`}
                      >
                         <div className="relative z-10">
                            <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">{opt.label}</p>
                            <p className={`text-[10px] uppercase font-black tracking-[0.3em] ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover/opt:text-blue-400'}`}>
                              {isSelected ? 'ACTIVE' : 'UPGRADE'}
                            </p>
                         </div>
                      </button>
                    )
                  })}
               </div>
            </div>
            <button onClick={() => setActiveSubView(null)} className="btn-neural btn-neural-primary w-full mt-12 text-sm uppercase">Close Allocation Hub</button>
          </div>
        );
      }

      case 'Help Terminal':
        return (
          <div className="Vault-card p-0 bg-slate-900 text-emerald-400 font-mono overflow-hidden animate-slide-up shadow-2xl border-2 border-slate-800 rounded-[2.5rem]">
            <div className="bg-slate-800/80 backdrop-blur-md px-8 py-5 flex items-center justify-between border-b border-white/5">
               <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                  <div className="w-3.5 h-3.5 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               </div>
               <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.5em] uppercase">Bash v4.2 stable</p>
            </div>
            <div className="p-10 text-xs md:text-sm leading-relaxed max-h-[450px] overflow-y-auto custom-scrollbar">
               <p className="mb-3 text-white/30">{'>>>'} INITIALIZING ARCHITECT PROTOCOLS...</p>
               <p className="mb-3"><span className="text-white">root@Vault:~#</span> user_audit --active</p>
               <p className="mb-3 text-emerald-500">{'>>'} Identity: {user?.name || 'Vault-X'}</p>
               <p className="mb-3 text-emerald-500">{'>>'} Cluster: {user?.plan || 'STANDARD'}</p>
               <p className="mb-3 text-emerald-500">{'>>'} Encryption: VERIFIED_AES_256</p>
               <p className="mb-3"><span className="text-white">root@Vault:~#</span> fetch system_health --all</p>
               <p className="mb-3 text-blue-400">[CORE] Uptime: 99.9% (Verified)</p>
               <p className="mb-3 text-blue-400">[MESH] Nodes: 3 Live / 1 Latent</p>
               <p className="mb-3 text-blue-400">[LATENCY] Global-1: 12ms</p>
               <p className="mb-3"><span className="text-white">root@Vault:~#</span> <span className="animate-pulse">_</span></p>
            </div>
            <div className="p-6 bg-slate-800/30 border-t border-white/5 flex gap-6">
               <button onClick={() => setActiveSubView(null)} className="px-10 py-4 bg-slate-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-600 transition-all">Exit BASH</button>
               <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">Purge Logs</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 md:space-y-14 animate-slide-up max-w-4xl mx-auto pb-32">
      {!activeSubView ? (
        <>
          {/* Neural Profile Hub */}
          <div className="glass-dark rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shard-card group shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-1000"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 relative z-10 text-center md:text-left">
              <div className="relative group/avatar">
                <div className="w-28 h-28 md:w-40 md:h-40 bg-white/5 rounded-[3rem] p-1.5 backdrop-blur-2xl ring-4 ring-white/5 group-hover/avatar:ring-blue-500/30 transition-all duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-[2.8rem] flex items-center justify-center text-5xl md:text-6xl font-black shadow-2xl overflow-hidden relative">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                    ) : (
                      <span className="group-hover/avatar:scale-110 transition-transform duration-700 uppercase">{user?.name?.charAt(0) || 'S'}</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-14 md:h-14 bg-emerald-500 rounded-3xl border-8 border-[#0F172A] flex items-center justify-center shadow-2xl group-hover/avatar:scale-110 transition-all duration-500">
                  <div className="w-2 md:w-3 h-2 md:h-3 bg-white rounded-full animate-neural-pulse"></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4">
                  <h2 className="text-4xl md:text-6xl font-black tracking-[-0.05em] uppercase leading-none">{user?.name || 'Vault'}</h2>
                  <span className="bg-blue-500/20 text-[10px] md:text-xs text-blue-400 font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-blue-500/30 backdrop-blur-md mb-1">
                    {user?.plan || 'STANDARD'}
                  </span>
                </div>
                <p className="text-slate-400 font-black text-xs md:text-sm tracking-[0.4em] uppercase mb-10">{user?.email || 'OFFLINE@MESH.SH'}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl group-hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Cipher</p>
                    <p className="text-xs font-black tracking-widest uppercase">AESX-256</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl group-hover:bg-white/10 transition-colors">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nodes</p>
                    <p className="text-xs font-black tracking-widest uppercase">3 Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Settings Relay */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Security Core', icon: 'shield', desc: 'Node Biometrics' },
              { label: 'Neural Sync', icon: 'refresh', desc: 'Mesh Buffers' },
              { label: 'Vault Allocation', icon: 'database', desc: 'Expand Nodes' },
              { label: 'Access Logs', icon: 'clock', desc: 'Audit History' },
              { label: 'System Mode', icon: 'cpu', desc: 'OS X-4.2' },
              { label: 'Help Terminal', icon: 'help', desc: 'Bash Root' }
            ].map((item, i) => (
              <button 
                key={i} 
                onClick={() => setActiveSubView(item.label === 'Access Logs' ? 'Access History' : item.label)}
                className="Vault-card p-8 md:p-10 bg-white border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 group transition-all duration-500 text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex flex-col gap-8 relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-[1.75rem] flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                      {item.icon === 'refresh' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                      {item.icon === 'database' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                      {item.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {item.icon === 'cpu' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2-2v10a2 2 0 002 2zM9 9h6v6H9V9z" />}
                      {item.icon === 'help' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg md:text-xl tracking-tighter uppercase mb-2 group-hover:text-blue-600 transition-colors">{item.label}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none opacity-60 group-hover:opacity-100 transition-opacity uppercase">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-10">
            <button 
              onClick={onLogout}
              className="w-full Vault-card p-10 bg-rose-50 border-2 border-rose-100 hover:bg-rose-100 hover:border-rose-300 transition-all flex items-center justify-between group shadow-xl shadow-rose-500/5"
            >
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-white rounded-[1.75rem] flex items-center justify-center text-rose-500 shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="text-left">
                  <h4 className="font-black text-rose-600 text-2xl md:text-3xl tracking-tighter uppercase mb-2">Disconnect</h4>
                  <p className="text-[11px] font-black text-rose-400 uppercase tracking-[0.3em] leading-none uppercase">Purge Active Session</p>
                </div>
              </div>
              <svg className="w-8 h-8 text-rose-300 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-10">
          <button 
            onClick={() => setActiveSubView(null)}
            className="group inline-flex items-center gap-4 text-slate-400 hover:text-blue-600 font-extrabold text-xs uppercase tracking-[0.5em] transition-all mb-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <span>Protocol Root</span>
          </button>
          {renderSubView()}
        </div>
      )}

      {showPaymentModal && pendingStorage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in px-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-slide-up border border-slate-100 p-12 md:p-16">
            {paymentSuccess ? (
              <div className="text-center py-10">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/10">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-6">Payment Verified</h3>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] mt-4 px-10">Node capacity extended to {pendingStorage.label}</p>
                <button 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentSuccess(false);
                  }}
                  className="mt-12 btn-neural btn-neural-primary w-full py-6 text-sm uppercase"
                >
                  Confirm Cluster
                </button>
              </div>
            ) : (
              <div>
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-4">Extend Node</h3>
                       <p className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] uppercase">Allocate {pendingStorage.label} Shard Cluster</p>
                    </div>
                    <button onClick={() => setShowPaymentModal(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                 </div>
                
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 mb-10 flex items-center justify-between shadow-inner">
                   <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Subscription Volume</p>
                      <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">${pendingStorage.value === 512 ? '4.99' : pendingStorage.value === 1024 ? '9.99' : '19.99'} <span className="text-lg font-bold text-slate-400">/mo</span></p>
                   </div>
                   <div className="w-20 h-20 bg-white text-blue-600 rounded-[1.75rem] flex items-center justify-center shadow-xl border border-slate-50">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                   </div>
                </div>

                <div className="bg-blue-50/50 p-8 rounded-[2rem] border-2 border-dashed border-blue-200 flex items-center justify-between mb-12">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.97-1.3-3.15-3.01-3.55V6h-1.3v2.04c-1.54.23-2.73 1.39-2.73 2.92 0 1.94 1.5 2.7 3.41 3.14 1.99.47 2.34 1.15 2.34 1.84 0 .71-.58 1.48-2.2 1.48-1.57 0-2.34-.84-2.43-1.89h-1.76c.12 1.88 1.38 2.97 3.09 3.33V21h1.3v-2.02c1.68-.24 2.85-1.45 2.85-3.05 0-2.35-1.83-3.02-3.27-3.37z"/></svg>
                      </div>
                      <div>
                         <p className="font-black tracking-tight text-lg text-slate-900 leading-none mb-1">Razorpay Secured</p>
                         <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] uppercase">Verified Relay established</p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
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
                          alert('Razorpay Gateway error.');
                          setIsProcessingPayment(false);
                          return;
                       }

                       const options = {
                           key: 'rzp_test_placeholder', 
                           amount: (pendingStorage.value === 512 ? 499 : pendingStorage.value === 1024 ? 999 : 1999) * 100,
                           currency: 'INR',
                           name: 'Vault Vault',
                           description: `Extend Node: ${pendingStorage.label}`,
                           image: 'https://ui-avatars.com/api/?name=S&background=0052A1&color=fff',
                           handler: function (response: any) {
                               setPaymentSuccess(true);
                               onSave({ ...settings, totalStorage: pendingStorage.value });
                           },
                           prefill: { name: user?.name, email: user?.email },
                           theme: { color: '#0052A1' },
                           modal: { ondismiss: () => setIsProcessingPayment(false) }
                       };

                       const paymentObject = new (window as any).Razorpay(options);
                       paymentObject.open();
                    }}
                    disabled={isProcessingPayment}
                    className="btn-neural btn-neural-primary w-full py-6 text-sm uppercase shadow-2xl shadow-blue-500/40"
                  >
                    {isProcessingPayment ? 'ESTABLISHING RELAY...' : `INITIALIZE EXTENSION`}
                  </button>
                  <button onClick={() => setShowPaymentModal(false)} className="py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-900 transition-colors uppercase">Cancel Protocol</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center pt-20">
         <p className="text-[11px] font-black text-slate-200 uppercase tracking-[0.6em] uppercase">Vault OS v4.2 Mesh Cluster</p>
      </div>
    </div>
  );
}
