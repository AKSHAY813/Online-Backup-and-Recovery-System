

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { 
    id: 'dashboard', 
    label: 'Home', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    id: 'backup', 
    label: 'Backup', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    )
  },
  { 
    id: 'recovery', 
    label: 'Restore', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    )
  },
  { 
    id: 'schedule', 
    label: 'Cal', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    id: 'settings', 
    label: 'Set', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-8 left-6 right-6 z-50">
      <nav className="bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 flex justify-around items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl transition-all duration-500 ${
              activeTab === id
                ? 'text-white'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {activeTab === id && (
              <div className="absolute inset-x-2 inset-y-1.5 bg-blue-600 rounded-xl animate-in zoom-in-90 fade-in duration-500 shadow-lg shadow-blue-500/20"></div>
            )}
            <div className={`relative z-10 transition-all duration-500 ${activeTab === id ? 'scale-110 -translate-y-0.5' : 'scale-100 opacity-60'}`}>
              {icon}
            </div>
            <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest transition-opacity duration-500 ${activeTab === id ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
