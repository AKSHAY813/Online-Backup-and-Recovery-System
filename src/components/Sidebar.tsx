import { cn } from '@/utils/cn';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'backup', label: 'Backup', icon: 'cloud-upload' },
  { id: 'recovery', label: 'Recovery', icon: 'refresh' },
  { id: 'schedule', label: 'Schedules', icon: 'clock' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  'cloud-upload': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  refresh: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-72 bg-[#0F172A] text-white flex-col min-h-screen relative overflow-hidden border-r border-white/5 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="p-10 relative z-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 rotate-3 group-hover:rotate-0 transition-transform duration-700 ring-2 ring-white/10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tighter leading-none group-hover:text-blue-400 transition-colors">Sentinel</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1.5 leading-none">Blue Node</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 relative z-10">
        <ul className="space-y-3">
          {menuItems.map((item) => (
            <li key={item.id} className="px-2">
              <button
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all duration-500 relative group overflow-hidden',
                  activeTab === item.id
                    ? 'text-white shadow-[0_15px_30px_-10px_rgba(37,99,235,0.3)] bg-blue-600'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                )}
              >
                <div className={cn(
                  "relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                  activeTab === item.id ? "text-white" : "text-slate-600 group-hover:text-blue-400"
                )}>
                  {icons[item.icon]}
                </div>
                <span className={cn(
                  "relative z-10 font-bold text-[13px] uppercase tracking-[0.15em] transition-all duration-500",
                  activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-slate-200"
                )}>
                  {item.label}
                </span>
                
                {activeTab === item.id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full animate-in slide-in-from-right duration-700"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-8 relative z-10">
        <div className="glass-dark rounded-[2rem] p-6 group/status hover:scale-[1.02] transition-all duration-700 cursor-default shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner group-hover/status:rotate-12 transition-transform duration-700">
              <svg className="w-6 h-6 shadow-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">Defense Active</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">AES-256 GCM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
