import { useState, useEffect, useRef } from 'react';

export function Backup() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadStats, setUploadStats] = useState({ speed: '0 MB/s', remaining: '0s', volume: '0 GB / 0 GB' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      startSimulatedUpload(files);
    }
  };

  const startSimulatedUpload = (files: File[]) => {
    setIsUploading(true);
    setProgress(0);
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    
    let uploaded = 0;
    setCurrentFileName(files[0]?.name || 'Files');

    const interval = setInterval(() => {
      uploaded += totalSize / 50; // Simulate 50 steps
      const newProgress = Math.min(Math.round((uploaded / totalSize) * 100), 100);
      
      setProgress(newProgress);
      setUploadStats({
        speed: (Math.random() * 10 + 20).toFixed(1) + ' MB/s',
        remaining: Math.max(0, Math.round((100 - newProgress) / 5)) + 's',
        volume: `${(uploaded / (1024 * 1024 * 1024)).toFixed(2)} GB / ${totalSizeGB} GB`
      });

      if (newProgress === 100) {
        clearInterval(interval);
        setIsUploading(false);
        // Persist the backup in mock storage
        import('@/services/mockApi').then(m => {
          m.mockApi.createBackup(files[0].name, totalSize);
        });
      }
    }, 200);
  };


  return (
    <div className="space-y-12 animate-slide-up pb-16">
      {/* AI Insight Card */}
      <div className="glass-dark rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group cursor-default">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <svg className="w-32 h-32 rotate-12" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
         </div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-blue-500/20 rounded-[2rem] flex items-center justify-center border border-white/10 shadow-inner">
               <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div>
               <div className="flex items-center gap-3 mb-3">
                  <span className="sentinel-badge bg-blue-500/20 text-blue-300 border border-blue-500/30">Neural Engine v4.2</span>
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
               </div>
               <h3 className="text-3xl font-black mb-2 tracking-tight">Architectural Protection</h3>
               <p className="text-blue-100/70 font-medium max-w-xl text-lg leading-relaxed">
                  Our neural engine has identified optimal sharding patterns for your assets. Encryption speed is currently <span className="text-blue-400 font-black">42% faster</span> on this node.
               </p>
            </div>
         </div>
      </div>

      {/* Upload Progress Area */}
      <div className="px-2">
         <div className="flex items-end justify-between mb-10">
            <div>
               <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  {isUploading ? (
                    <>Deploying<br /><span className="text-blue-600">Assets...</span></>
                  ) : (
                    <>System<br /><span className="text-blue-600">Idle.</span></>
                  )}
               </h1>
               {isUploading && (
                 <p className="text-slate-400 font-bold uppercase tracking-widest mt-6 flex items-center gap-3">
                   <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                   Syncing: {currentFileName}
                 </p>
               )}
            </div>
            <div className="text-right">
               <span className="text-9xl font-black text-[#0F172A] tracking-tighter tabular-nums leading-none opacity-10 absolute right-10 -mt-10 pointer-events-none">
                  {progress}%
               </span>
               <span className="text-8xl font-black text-[#0052A1] tracking-tighter tabular-nums leading-none block relative">
                  {progress}%
               </span>
            </div>
         </div>

         <div className="sentinel-progress h-5 bg-slate-100/50 mb-12 ring-8 ring-slate-50">
            <div className={`sentinel-progress-bar h-full transition-all duration-300 ${isUploading ? 'bg-blue-600' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }}></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Transmission Speed</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{isUploading ? uploadStats.speed : '0.0 MB/s'}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Time to Sync</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{isUploading ? uploadStats.remaining : '0s'}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Total Shard Volume</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{isUploading ? uploadStats.volume : '0.0 GB / 2.0 TB'}</p>
            </div>
         </div>
      </div>

      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
         {/* Total Vault Storage - Dynamicish */}
         <div className="sentinel-card p-10 bg-white border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Total Vault Capacity</h3>
               <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13h-8z" />
                  </svg>
               </div>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
               <span className="text-5xl font-black text-slate-900 leading-none">1.2</span>
               <span className="text-xl font-bold text-slate-400 uppercase tracking-widest leading-none">TB</span>
               <span className="text-slate-400 font-bold ml-auto text-sm uppercase tracking-widest">of 2.0 TB used</span>
            </div>
            <div className="sentinel-progress h-2.5 mb-6 bg-slate-100">
               <div className="sentinel-progress-bar" style={{ width: '60%' }}></div>
            </div>
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Usage</span>
               <span className="text-sm font-black text-blue-600 uppercase tracking-widest">60% Complete</span>
            </div>
         </div>

         {/* Actions */}
         <div className="flex flex-col gap-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="group flex-1 sentinel-card p-8 flex items-center gap-6 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left overflow-hidden relative"
            >
               <div className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:rotate-12 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
               </div>
               <div>
                  <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2">Deploy New Shard</p>
                  <p className="text-sm font-medium text-slate-500">Initiate encrypted upload from local node</p>
               </div>
               <div className="absolute top-1/2 -right-4 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
            </button>
            <button className="group flex-1 sentinel-card p-8 flex items-center gap-6 hover:border-rose-500 hover:bg-rose-50/30 transition-all text-left overflow-hidden relative">
               <div className="w-16 h-16 bg-white border-2 border-slate-100 text-rose-600 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:text-white group-hover:bg-rose-600 group-hover:border-rose-600 transition-all">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <div>
                  <p className="font-black text-slate-900 text-xl tracking-tight leading-none mb-2">Suspend Protocols</p>
                  <p className="text-sm font-medium text-slate-500">Temporarily freeze all active network uplinks</p>
               </div>
               <div className="absolute top-1/2 -right-4 w-24 h-24 bg-rose-600/5 rounded-full blur-3xl group-hover:bg-rose-600/10 transition-colors"></div>
            </button>
         </div>
      </div>

      {/* Queue Status Mini List */}
      <div className="sentinel-card mt-8 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/30">
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Transmission Queue</h3>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending neural verification</p>
        </div>
        <div className="divide-y divide-slate-100">
           {[
             { name: 'DCIM_001.jpg', icon: 'check', status: 'Verified', size: '1.2 MB' },
             { name: 'SystemLogs_2025.txt', icon: 'warning', status: 'Warning', size: '45 KB' },
             { name: 'VideoProject_Final.mp4', icon: 'sync', status: 'Syncing...', size: '850 MB' }
           ].map((item, i) => (
             <div key={i} className="px-10 py-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                      item.icon === 'check' ? 'bg-emerald-100/50 text-emerald-600' :
                      item.icon === 'warning' ? 'bg-amber-100/50 text-amber-600' : 'bg-blue-100/50 text-blue-600'
                   } group-hover:scale-110 transition-transform`}>
                      {item.icon === 'check' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {item.icon === 'warning' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )}
                      {item.icon === 'sync' && (
                        <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                   </div>
                   <div>
                      <p className="font-black text-slate-800 text-base leading-none tracking-tight mb-2">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-black text-slate-500 tabular-nums">{item.size}</p>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
