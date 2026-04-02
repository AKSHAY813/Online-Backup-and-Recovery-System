import { useState, useEffect } from 'react';
import type { StorageStats, BackupItem } from '@/types';
import { mockApi } from '@/services/mockApi';

export function Dashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVaultBrowser, setShowVaultBrowser] = useState(false);
  const [showDeviceScanner, setShowDeviceScanner] = useState(false);
  const [deviceFiles, setDeviceFiles] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent || '');
  
  useEffect(() => {
    // Generate mock local files depending on device type
    if (isMobile) {
       setDeviceFiles([
          { id: 'm1', name: 'IMG_20250101.jpg', size: '4.2 MB', icon: 'image' },
          { id: 'm2', name: 'WhatsApp_Video.mp4', size: '15.8 MB', icon: 'video' },
          { id: 'm3', name: 'Scan_Document.pdf', size: '1.5 MB', icon: 'doc' }
       ]);
    } else {
       setDeviceFiles([
          { id: 'd1', name: 'Project_Codebase.zip', size: '124.5 MB', icon: 'zip' },
          { id: 'd2', name: 'Financial_Report.xlsx', size: '2.8 MB', icon: 'doc' },
          { id: 'd3', name: 'Design_Assets.fig', size: '45.2 MB', icon: 'design' }
       ]);
    }
  }, [isMobile]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockApi.getDashboardData();
        setStats(data.stats);
        setBackups(data.recentBackups);
        // Auto show device scanner only for new users with no backups
        if (data.recentBackups.length === 0) {
          setTimeout(() => setShowDeviceScanner(true), 1500);
        }
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
           <button 
             onClick={() => setShowVaultBrowser(true)}
             className="flex items-center gap-3 px-8 py-5 bg-[#0052A1] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/40 hover:bg-blue-800 transition-all hover:scale-105 active:scale-95 group"
           >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Browse Internet Vault
           </button>
           <button 
             onClick={() => setShowDeviceScanner(true)}
             className="flex items-center gap-3 px-8 py-5 bg-white text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all hover:border-slate-300"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Scan local device
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

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Cloud Files</span>
                     <span className="text-2xl font-black text-slate-800 tracking-tight">{stats?.firebaseFileCount || 0} Synced</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Internet Storage</span>
                     <span className="text-2xl font-black text-slate-800 tracking-tight">{((stats?.used || 0) * 0.4).toFixed(1)} GB</span>
                  </div>
               </div>

               {/* Category Quick Preview */}
               <div className="grid grid-cols-4 gap-2 mt-4">
                  {stats?.categories && Object.entries(stats.categories).map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-2xl border border-slate-100 text-center hover:shadow-md transition-shadow group/chip">
                       <span className="text-[7px] font-black text-slate-400 uppercase block mb-1 group-hover/chip:text-blue-500 transition-colors uppercase">{key}</span>
                       <span className="text-[10px] font-black text-slate-700">{value.backedUp}</span>
                    </div>
                  ))}
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
                { name: 'Primary Terminal (Active)', label: isMobile ? 'iPhone Node' : 'Laptop Node', status: 'online', icon: isMobile ? 'mobile' : 'laptop' },
                { name: 'Cloud Hub Connection', label: 'Firebase RTDB Sync', status: 'online', icon: 'cloud' },
                { name: 'Backup Relay', label: 'Decentralized Node', status: 'online', icon: 'relay' }
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-default group/node">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm group-hover/node:text-blue-600 group-hover/node:rotate-6 transition-all">
                         {node.icon === 'mobile' ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                         ) : node.icon === 'cloud' ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
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
                 <div 
                   key={item.id} 
                   onClick={() => item.url && window.open(item.url, '_blank')}
                   className={`px-10 py-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all ${item.url ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                          item.type === 'folder' ? 'bg-amber-100/50 text-amber-600' : 
                          item.type === 'web' || item.url ? 'bg-indigo-100/50 text-indigo-600' : 'bg-blue-100/50 text-blue-600'
                       } group-hover:scale-110 transition-transform`}>
                          {item.type === 'folder' ? (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                               <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                          ) : item.type === 'web' || item.url ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          ) : (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                               <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          )}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <p className={`font-black text-lg leading-none tracking-tight ${item.url ? 'text-indigo-900 group-hover:text-blue-700' : 'text-slate-900'}`}>{item.name}</p>
                             {item.url && (
                               <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                               </svg>
                             )}
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Synced to CloudVault Hub • {new Date(item.lastBackup).toLocaleTimeString()}
                          </p>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <p className="text-base font-black text-slate-900 leading-none mb-2">{item.size}</p>
                       <span className={`sentinel-badge ${item.url ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : (i === 0 ? 'sentinel-badge-green' : 'sentinel-badge-blue')}`}>
                          {item.url ? 'Cloud Linked' : (i === 0 ? 'Verified' : 'Indexed')}
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

      {/* Vault Browser Modal */}
      {showVaultBrowser && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Internet Vault</h2>
                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Files extracted from web</p>
                 </div>
                 <button onClick={() => setShowVaultBrowser(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm border border-slate-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 bg-white">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {backups.filter(b => b.url).length > 0 ? backups.filter(b => b.url).map((file) => (
                       <div key={file.id} onClick={() => file.url && window.open(file.url, '_blank')} className="sentinel-card p-6 cursor-pointer group hover:border-[#0052A1]">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          </div>
                          <p className="font-black text-slate-900 tracking-tight text-lg leading-tight mb-2 truncate group-hover:text-indigo-700 transition-colors">{file.name}</p>
                          <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-slate-400">{file.size}</span>
                             <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Open Web</span>
                          </div>
                       </div>
                    )) : (
                       <div className="col-span-full text-center py-20">
                          <p className="text-slate-400 font-bold uppercase tracking-widest">No web files imported yet. Paste a link in Backup section to start.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
         </div>
      )}

      {/* Local Device Scanner Modal */}
      {showDeviceScanner && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
           <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden flex flex-col shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-slide-up border border-slate-100">
              <div className="p-10 border-b border-slate-100 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight relative z-10">Detected <span className="text-[#0052A1]">{isMobile ? 'Mobile' : 'Laptop'} Node</span></h2>
                 <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-2 relative z-10">Scanning local storage arrays...</p>
                 <button onClick={() => setShowDeviceScanner(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors z-20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                 <div className="space-y-4">
                    {deviceFiles.map((file) => (
                       <div key={file.id} className="flex justify-between items-center bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group hover:border-[#0052A1] hover:bg-blue-50/20 transition-all">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0052A1] group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                             </div>
                             <div>
                                <p className="font-black text-slate-900 text-lg tracking-tight leading-none group-hover:text-[#0052A1] transition-colors">{file.name}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{file.size}</p>
                             </div>
                          </div>
                          <button 
                             onClick={async () => {
                                const res = await mockApi.createBackup(file.name, parseFloat(file.size) * 1024 * 1024);
                                setBackups([res, ...backups]);
                                setToast(`✅ ${file.name} saved to CloudVault!`);
                                setTimeout(() => setToast(null), 4000);
                             }}
                             className="px-6 py-2.5 bg-[#0052A1] text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform transition hover:-translate-y-0.5 active:translate-y-0 text-sm"
                          >
                             Backup Now
                          </button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
         </div>
      )}

      {/* In-App Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
          <div className="px-8 py-4 bg-emerald-600/95 backdrop-blur-xl text-white rounded-[1.5rem] shadow-2xl flex items-center gap-4 border border-emerald-400/40">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-black text-sm tracking-tight">{toast}</p>
          </div>
        </div>
      )}

      {/* Side Terminal Peek (Only on Desktop) */}
      <div className="hidden 2xl:block fixed top-1/2 -translate-y-1/2 left-8 w-64 sentinel-card p-6 bg-slate-900 text-emerald-400 font-mono text-[9px] border border-slate-800 shadow-2xl opacity-60 hover:opacity-100 transition-opacity">
         <p className="border-b border-white/5 pb-2 mb-2 text-slate-500 uppercase tracking-widest font-black">System Feed</p>
         <p className="mb-1 text-white/20">{'>'} CPU_LOAD: 12%</p>
         <p className="mb-1">{'>'} RTDB: CONNECTED</p>
         <p className="mb-1">{'>'} SHARDING: ACTIVE</p>
         <p className="mb-1">{'>'} USER: {(() => { try { const u = localStorage.getItem('cloudvault_user'); return u ? JSON.parse(u).name : 'SENTINEL'; } catch { return 'SENTINEL'; } })()}</p>
         <p className="animate-pulse">{'>'} _</p>
      </div>
    </div>
  );
}
