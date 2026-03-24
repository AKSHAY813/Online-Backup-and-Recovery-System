interface SettingsProps {
  user: any;
  settings: any;
  onSave: (settings: any) => void;
  onLogout: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  return (
    <div className="space-y-12 animate-slide-up max-w-3xl mx-auto pb-20 font-['Outfit']">
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
          { label: 'System Updates', icon: 'cpu', desc: 'Check for Sentinel OS patches' },
          { label: 'Help Terminal', icon: 'help', desc: 'Reach out to global support' }
        ].map((item, i) => (
          <button key={i} className="sentinel-card p-6 bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl group transition-all text-left">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 transform group-hover:rotate-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon === 'shield' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                  {item.icon === 'refresh' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />}
                  {item.icon === 'database' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />}
                  {item.icon === 'clock' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  {item.icon === 'cpu' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />}
                  {item.icon === 'help' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                </svg>
              </div>
              <div>
                <h4 className="font-black text-slate-900 tracking-tighter uppercase mb-0.5">{item.label}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.desc}</p>
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

      <div className="text-center pt-8">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sentinel OS v4.0.1 Stable Cluster</p>
      </div>
    </div>
  );
}
