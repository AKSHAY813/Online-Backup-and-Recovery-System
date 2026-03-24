import { useState, useEffect } from 'react';
import type { StorageStats, BackupItem } from '@/types';
import { mockApi } from '@/services/mockApi';

export function Dashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockApi.getDashboardData();
        setStats(data.stats);
        setBackups(data.recentBackups);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const storagePercent = stats ? (stats.used / stats.total) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-20 w-3/4 bg-slate-200 rounded-3xl mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 rounded-[2.5rem]"></div>
          <div className="h-96 bg-slate-200 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      {/* Status Header */}
      <div className="px-2 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
           <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Node Armed</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Last Verified 12m Ago</span>
           </div>
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
          System Is<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Fully Secured.</span>
        </h1>
        
        <p className="text-slate-500 font-bold text-lg max-w-lg leading-relaxed">
          Your architectural assets are decentralized and sharded across 3 secure global nodes.
        </p>

        <div className="flex items-center gap-6 mt-10">
           <button className="flex items-center gap-3 px-8 py-5 bg-[#0052A1] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-800 transition-all hover:scale-105 active:scale-95 group">
              <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Deploy Backup
           </button>
           <button className="flex items-center gap-3 px-8 py-5 bg-white text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300">
              Browse Vault
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Vault Capacity */}
        <div className="sentinel-card p-10 flex flex-col justify-between min-h-[420px] group/card">
           <div className="flex items-center justify-between mb-10">
              <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vault Capacity</h3>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1.5">Standard Shard Protocol</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover/card:scale-110 transition-transform duration-500">
                 <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13h-8z" />
                 </svg>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-baseline gap-3">
                 <span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums leading-none">
                   {stats?.used || '0.0'}
                 </span>
                 <div className="flex flex-col">
                   <span className="text-xl font-black text-blue-600 leading-none">GB</span>
                   <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Used</span>
                 </div>
                 <span className="text-slate-400 font-bold ml-auto text-sm uppercase tracking-widest">of {stats?.total}GB Vault</span>
              </div>
              
              <div className="sentinel-progress h-3.5 bg-slate-100 ring-4 ring-slate-50">
                 <div 
                   className="sentinel-progress-bar h-full" 
                   style={{ width: `${storagePercent}%` }}
                 ></div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Encrypted Media</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">77.5 GB</span>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">System Shards</span>
                    <span className="text-2xl font-black text-slate-800 tracking-tight">42.5 GB</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Secure Nodes */}
        <div className="sentinel-card p-10 flex flex-col min-h-[420px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Secure Nodes</h3>
              <span className="sentinel-badge sentinel-badge-blue">3 Active</span>
           </div>
           
           <div className="space-y-7 flex-1">
              {[
                { name: 'MacBook Pro Architect', label: 'Primary Terminal', status: 'online', icon: 'laptop' },
                { name: 'iPhone 15 Pro Max', label: 'Mobile Uplink', status: 'online', icon: 'mobile' },
                { name: 'Workstation-Omega', label: 'Disconnected', status: 'offline', icon: 'workstation' }
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-default group/node">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm group-hover/node:text-blue-600 group-hover/node:rotate-6 transition-all">
                         {node.icon === 'mobile' ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                         ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                         )}
                      </div>
                      <div>
                         <p className="font-black text-slate-900 text-base tracking-tight leading-none mb-2">{node.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{node.label}</p>
                      </div>
                   </div>
                   <div className={`w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                </div>
              ))}
           </div>
           
           <button className="mt-8 w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-sm font-black text-slate-400 uppercase tracking-[0.2em] hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-[0.98]">
              Link New Node
           </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="sentinel-card overflow-hidden">
        <div className="px-10 py-8 border-b border-light flex items-center justify-between bg-slate-50/30">
           <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Neural Sync Activity</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time backup logging</p>
           </div>
           <button className="px-6 py-2.5 text-xs font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded-xl transition-all">Export Logs</button>
        </div>
        <div className="divide-y divide-slate-100">
           {backups.length > 0 ? (
             backups.slice(0, 5).map((item, i) => (
               <div key={item.id} className="px-10 py-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                  <div className="flex items-center gap-6">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                        item.type === 'folder' ? 'bg-amber-100/50 text-amber-600' : 'bg-blue-100/50 text-blue-600'
                     } group-hover:scale-110 transition-transform`}>
                        {item.type === 'folder' ? (
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                             <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        )}
                     </div>
                     <div>
                        <p className="font-black text-slate-900 text-lg leading-none tracking-tight mb-2">{item.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Synced to CloudVault Hub • {new Date(item.lastBackup).toLocaleTimeString()}
                        </p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-base font-black text-slate-900 leading-none mb-2">{item.size}</p>
                     <span className={`sentinel-badge ${i === 0 ? 'sentinel-badge-green' : 'sentinel-badge-blue'}`}>
                        {i === 0 ? 'Verified' : 'Indexed'}
                     </span>
                  </div>
               </div>
             ))
           ) : (
             <div className="p-20 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2 2m16-4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v.01M6 20h12a2 2 0 002-2V9a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
                 </svg>
               </div>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Shards Found</p>
             </div>
           )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-10 z-40 md:bottom-12">
         <button className="w-20 h-20 bg-[#0052A1] text-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,82,161,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group ring-4 ring-white">
            <svg className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
         </button>
      </div>
    </div>
  );
}
