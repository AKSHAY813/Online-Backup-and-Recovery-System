import { useState, useEffect } from 'react';
import type { StorageStats, BackupItem } from '@/types';
import { mockApi } from '@/services/mockApi';
import { neuralEngine } from '@/services/neuralEngine';

export function Dashboard() {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVaultBrowser, setShowVaultBrowser] = useState(false);
  const [showDeviceScanner, setShowDeviceScanner] = useState(false);
  const [deviceFiles, setDeviceFiles] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Advanced AI States
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [optimization, setOptimization] = useState<any>(null);
  const [liveNodes, setLiveNodes] = useState<any[]>([]);
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

        // Load Advanced AI Data
        const insights = await neuralEngine.getPredictiveInsights();
        setAiInsights(insights);
        setOptimization(neuralEngine.getStorageOptimization());
        setLiveNodes(neuralEngine.getLiveNodes());

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
    <div className="space-y-12 pb-16 relative">
      {/* Background Mesh Visual */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none overflow-hidden h-[500px]">
         <div className="w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full -mr-96 -mt-96 animate-pulse"></div>
      </div>

      {/* Status Header */}
      <div className="px-2 animate-slide-up">
        <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
               <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Mesh Guard Core Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Neural Sharding v4.2 Agent</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Mesh Latency: 12ms</span>
            </div>
        </div>
        
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
          AI Mesh System<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-600">Cognitive Protection.</span>
        </h1>
        
        {/* Advanced AI Insight Section - CAROUSEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-4">
           <div className="lg:col-span-2 glass-dark rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-4 right-10 bg-indigo-500/20 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-500/30">AI Predictive Insight</div>
              <div className="relative z-10">
                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black tracking-tight leading-none">Neural Prediction Engine</h3>
                       <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Active Asset Analysis Cycle</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    {aiInsights.map((insight) => (
                       <div key={insight.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between group/insight hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-5">
                             <div className={`w-2 h-2 rounded-full ${insight.urgency === 'High' ? 'bg-rose-500' : insight.urgency === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                             <div>
                                <p className="font-black text-sm text-slate-100 uppercase tracking-tight">{insight.fileName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{insight.reason}</p>
                             </div>
                          </div>
                          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg active:scale-95">{insight.action}</button>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Optimization Gauge */}
           <div className="sentinel-card p-10 bg-white border border-slate-100 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Storage Efficiency</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">AI Deduplication Gains</p>
              </div>
              <div className="my-10 text-center">
                 <div className="text-6xl font-black text-emerald-600 tracking-tighter leading-none mb-2">{optimization?.efficiency}</div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Metric</p>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Saved Space</span>
                    <span className="font-black text-slate-900">{optimization?.savedSpace}</span>
                 </div>
                 <div className="h-2 bg-slate-50 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full w-[92%]"></div>
                 </div>
                 <p className="text-[8px] font-bold text-slate-400 text-center uppercase tracking-widest leading-relaxed">AI detected and consolidated {optimization?.avoidedDuplicates} duplicate nodes</p>
              </div>
           </div>
        </div>

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
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1.5">Pro Sharding Protocol</p>
              </div>
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover/card:scale-110 transition-transform duration-500">
                 <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13h-8z" />
                 </svg>
              </div>
           </div>

           <div className="space-y-8">
              <div className="flex items-baseline gap-3">
                 <span className={`text-7xl font-black tracking-tighter tabular-nums leading-none ${storagePercent >= 100 ? 'text-red-600' : 'text-slate-900'}`}>
                   {stats?.used || '0.0'}
                 </span>
                 <div className="flex flex-col">
                   <span className={`text-xl font-black leading-none ${storagePercent >= 100 ? 'text-red-500' : 'text-indigo-600'}`}>GB</span>
                   <span className={`text-sm font-bold mt-1 uppercase tracking-widest ${storagePercent >= 100 ? 'text-red-400' : 'text-slate-400'}`}>Used</span>
                 </div>
                 <span className="text-slate-400 font-bold ml-auto text-sm uppercase tracking-widest">of {stats?.total}GB Vault</span>
              </div>
              
              <div className={`sentinel-progress h-3.5 ring-4 ${storagePercent >= 100 ? 'bg-red-100 ring-red-50' : 'bg-slate-100 ring-slate-50'}`}>
                 <div 
                   className={storagePercent >= 100 ? "h-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all" : "h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-700"}
                   style={{ width: `${Math.min(storagePercent, 100)}%` }}
                 ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Cloud Files</span>
                     <span className="text-2xl font-black text-slate-800 tracking-tight">{stats?.firebaseFileCount || 0} Synced</span>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Neural Nodes</span>
                     <span className="text-2xl font-black text-indigo-600 tracking-tight">{liveNodes.length} Verified</span>
                  </div>
               </div>
            </div>
        </div>

        {/* Secure Mesh Nodes */}
        <div className="sentinel-card p-10 flex flex-col min-h-[420px] bg-[#0F172A] text-white">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black tracking-tight">Active Neural Mesh</h3>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl text-emerald-400 border border-emerald-500/20">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest">P2P Encryption Active</span>
              </div>
           </div>
           
           <div className="space-y-6 flex-1">
               {liveNodes.map((node, i) => (
                <div key={node.id} className="flex items-center justify-between p-5 rounded-[1.75rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-default group/node">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover/node:rotate-6 transition-all">
                         {i === 0 ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         ) : i === 1 ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                         ) : (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                         )}
                      </div>
                      <div>
                         <p className="font-black text-sm tracking-tight leading-none mb-2 uppercase">{node.name}</p>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-indigo-400 tracking-widest">{node.latency} Latency</span>
                            <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                            <span className="text-[10px] font-black text-slate-500 tracking-widest">Load: {node.load}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{node.status}</span>
                   </div>
                </div>
              ))}
           </div>
           
           <button className="mt-8 w-full py-5 bg-white/5 border border-white/5 rounded-3xl text-xs font-black text-slate-400 uppercase tracking-[0.3em] hover:bg-white hover:text-slate-900 transition-all active:scale-[0.98]">
              Expand Neural Mesh
           </button>
        </div>
      </div>

      {/* Recent Neural Syncs */}
      <div className="sentinel-card overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Global Mesh Activity</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time cryptographic logs</p>
           </div>
           <button className="px-6 py-2.5 text-[10px] font-black text-indigo-600 border border-indigo-100 uppercase tracking-[0.2em] hover:bg-indigo-50 rounded-xl transition-all">Audit Logs</button>
        </div>
        <div className="divide-y divide-slate-100">
           {backups.length > 0 ? (
               backups.slice(0, 5).map((item, i) => (
                 <div 
                   key={item.id} 
                   onClick={() => item.url && window.open(item.url, '_blank')}
                   className={`px-10 py-6 flex items-center justify-between group hover:bg-indigo-50/30 transition-all ${item.url ? 'cursor-pointer' : ''}`}
                 >
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                          item.type === 'folder' ? 'bg-amber-100/50 text-amber-600' : 
                          item.type === 'web' || item.url ? 'bg-indigo-100/50 text-indigo-600' : 'bg-blue-100/50 text-blue-600'
                       } group-hover:scale-110 transition-transform`}>
                          {item.type === 'folder' ? (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                          ) : item.type === 'web' || item.url ? (
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                          ) : (
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                          )}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <p className={`font-black text-lg tracking-tight uppercase ${item.url ? 'text-indigo-900 group-hover:text-indigo-600' : 'text-slate-900'}`}>{item.name}</p>
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {item.url ? 'Cloud Linked' : 'Mesh Distributed'} • {new Date(item.lastBackup).toLocaleTimeString()}
                          </p>
                       </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <p className="text-base font-black text-slate-900 leading-none mb-2">{item.size}</p>
                       <span className={`sentinel-badge ${item.url ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : (i === 0 ? 'sentinel-badge-green' : 'sentinel-badge-blue')}`}>
                          {item.url ? 'Internet Shard' : (i === 0 ? 'Verified' : 'Healthy')}
                       </span>
                    </div>
                 </div>
               ))
           ) : (
              <div className="p-20 text-center text-slate-300">No active mesh transmissions.</div>
           )}
        </div>
      </div>

      {/* Floating Advanced Controller */}
      <div className="fixed bottom-24 right-10 z-40 md:bottom-12">
         <button className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-[0_20px_40px_rgba(79,70,229,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group ring-8 ring-indigo-50 border border-indigo-400/20">
            <svg className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
