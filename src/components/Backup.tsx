import { useState, useEffect, useRef } from 'react';
import { CloudImportModal } from './CloudImportModal';

export function Backup() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadStats, setUploadStats] = useState({ speed: '0 MB/s', remaining: '0s', volume: '0 GB / 0 GB' });
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Generate dynamic files for different categories
    const mockFiles = [
      { name: 'Wedding_Video.mp4', size: '1.2 GB', category: 'video', date: '2025-01-10' },
      { name: 'Research_Paper.pdf', size: '2.4 MB', category: 'document', date: '2025-02-15' },
      { name: 'Presentation.pptx', size: '15.8 MB', category: 'document', date: '2025-03-01' },
      { name: 'Profile_Picture.png', size: '4.2 MB', category: 'desktop', date: '2025-03-20' },
      { name: 'Setup_Wizard.exe', size: '45.1 MB', category: 'download', date: '2024-12-05' },
      { name: 'Holiday_Movie.mkv', size: '4.5 GB', category: 'video', date: '2025-01-22' },
      { name: 'Invoice_001.xlsx', size: '1.1 MB', category: 'document', date: '2025-03-25' },
    ];
    setScannedFiles(mockFiles);
  }, []);

  const handleCloudImport = (files: File[]) => {
    if (files && files.length > 0) {
       setSelectedFiles(files);
       startSimulatedUpload(files);
    }
  };

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
          const url = (files[0] as any).sourceUrl;
          m.mockApi.createBackup(files[0].name, totalSize, url);
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
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:bg-white text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Transmission Speed</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{isUploading ? uploadStats.speed : '0.0 MB/s'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:bg-white text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Time to Sync</p>
               <p className="text-3xl font-black text-slate-900 tracking-tight">{isUploading ? uploadStats.remaining : '0s'}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:bg-white text-center">
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
            <div className="flex gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="group flex-1 sentinel-card p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center overflow-hidden relative"
              >
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:rotate-12 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">Local Node</p>
                    <p className="text-xs font-medium text-slate-500">Deploy from device</p>
                  </div>
                  <div className="absolute top-1/2 -right-4 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
              </button>
              
              <button 
                onClick={() => setShowCloudModal(true)}
                className="group flex-1 sentinel-card p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-center overflow-hidden relative"
              >
                  <div className="w-14 h-14 bg-slate-50 text-[#0052A1] rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:rotate-12 group-hover:bg-[#0052A1] group-hover:text-white transition-all border border-slate-200 group-hover:border-transparent">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">Cloud Link</p>
                    <p className="text-xs font-medium text-slate-500">Drive, Dropbox, URL</p>
                  </div>
                  <div className="absolute top-1/2 -left-4 w-24 h-24 bg-blue-600/5 rounded-full blur-3xl group-hover:bg-blue-600/10 transition-colors"></div>
              </button>
            </div>
            
            <button className="group flex-1 sentinel-card p-6 flex flex-col items-center justify-center gap-4 hover:border-rose-500 hover:bg-rose-50/30 transition-all text-center overflow-hidden relative">
               <div className="w-14 h-14 bg-white border-2 border-slate-100 text-rose-600 rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:text-white group-hover:bg-rose-600 group-hover:border-rose-600 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <div>
                  <p className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1">Suspend Network Protocols</p>
                  <p className="text-xs font-medium text-slate-500">Temporarily freeze all active network uplinks</p>
               </div>
               <div className="absolute top-1/2 -right-4 w-24 h-24 bg-rose-600/5 rounded-full blur-3xl group-hover:bg-rose-600/10 transition-colors"></div>
            </button>
         </div>
      </div>

      {/* Backup Summary Section */}
      <div className="sentinel-card p-10 bg-[#0F172A] text-white overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
         <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
               <div>
                  <h3 className="text-4xl font-black tracking-tight mb-2">Backup Summary</h3>
                  <p className="text-blue-300/60 font-bold text-xs uppercase tracking-[0.2em]">Neural Categorization Analysis</p>
               </div>
               <button 
                 onClick={() => setShowSummaryDetails(!showSummaryDetails)}
                 className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95"
               >
                  {showSummaryDetails ? 'Hide Detail Analysis' : 'Click for Complete Summary'}
               </button>
            </div>

            {showSummaryDetails && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
                  {[
                    { label: 'Video', key: 'video', color: 'blue', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                    { label: 'Document', key: 'document', color: 'emerald', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { label: 'Desktop', key: 'desktop', color: 'amber', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                    { label: 'Download', key: 'download', color: 'rose', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' }
                  ].map((cat) => (
                     <div key={cat.label} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md group hover:bg-white/10 transition-all border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={cat.icon} /></svg>
                           </div>
                           <p className="text-sm font-black text-blue-400 uppercase tracking-widest">{cat.label}</p>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Storage Used</span>
                              <span className="text-base font-black">{(Math.random() * 5).toFixed(1)} GB</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Backed Up</span>
                              <span className="text-base font-black text-emerald-400">{Math.floor(Math.random() * 50) + 10}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Downloaded</span>
                              <span className="text-base font-black text-blue-400">{Math.floor(Math.random() * 30)}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>

      {/* Node Uplinks (Devices) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 sentinel-card p-10">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Node Uplinks</h3>
              <span className="sentinel-badge sentinel-badge-blue">2 Nodes Active</span>
           </div>
           <div className="space-y-4">
              {[
                { name: 'iPhone 15 Pro Max', status: 'Connected', sync: 'Neural Sync', icon: 'mobile', users: 3, activity: 'High' },
                { name: 'MacBook Pro Architect', status: 'Connected', sync: 'Direct Uplink', icon: 'laptop', users: 1, activity: 'Idle' }
              ].map((device, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-blue-500 hover:bg-white transition-all shadow-sm">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-all group-hover:rotate-3">
                        {device.icon === 'mobile' ? (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        ) : (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-lg tracking-tight leading-none mb-2 uppercase">{device.name}</p>
                        <div className="flex items-center gap-3">
                           <span className="bg-blue-100 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{device.users} Users Attached</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity: {device.activity}</p>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">{device.status}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
        
        <div className="sentinel-card p-10 bg-white border border-slate-100 text-slate-900 relative overflow-hidden transition-all hover:border-blue-200">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl -mr-16 -mt-16"></div>
           <h3 className="text-2xl font-black mb-8 tracking-tight uppercase">System Health</h3>
           <div className="space-y-8 relative z-10">
              <div>
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-slate-400">
                    <span>Sharding Protocol</span>
                    <span className="text-emerald-600">Verified</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-emerald-500 rounded-full w-[99.9%]"></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase mb-2 text-slate-400">Latency</p>
                    <p className="text-2xl font-black tracking-tight text-blue-600">12ms</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase mb-2 text-slate-400">Uptime</p>
                    <p className="text-2xl font-black tracking-tight text-blue-600">99.9%</p>
                 </div>
              </div>
           </div>
           <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl">Audit System Health</button>
        </div>
      </div>

      {/* Dynamic Scanned Files Queue */}
      <div className="sentinel-card mt-12 overflow-hidden border-2 border-blue-500/20">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-blue-50/30">
           <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Scanned Files on Node</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Detected in local storage arrays</p>
           </div>
           <div className="flex gap-2">
              {['all', 'video', 'document', 'download'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
        <div className="divide-y divide-slate-100">
           {scannedFiles.filter(item => activeCategory === 'all' || item.category === activeCategory).map((item, i) => (
             <div key={i} className="px-10 py-6 flex items-center justify-between group hover:bg-slate-50/80 transition-all">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                      item.category === 'video' ? 'bg-blue-100 text-blue-600' :
                      item.category === 'document' ? 'bg-emerald-100 text-emerald-600' :
                      item.category === 'download' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                   } group-hover:scale-110 transition-all`}>
                      {item.category === 'video' ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      ) : (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      )}
                   </div>
                   <div>
                      <p className="font-black text-slate-800 text-lg leading-none tracking-tight mb-2">{item.name}</p>
                      <div className="flex items-center gap-3">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                         <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                   <p className="text-base font-black text-slate-900 tabular-nums">{item.size}</p>
                   <button 
                     onClick={() => {
                        const file = new File([""], item.name, { type: "text/plain" });
                        (file as any).simulatedSize = item.size;
                        startSimulatedUpload([file]);
                     }}
                     className="px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                   >
                     Backup Now
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
      
      <CloudImportModal 
        isOpen={showCloudModal}
        onClose={() => setShowCloudModal(false)}
        onImport={handleCloudImport}
      />
    </div>
  );
}
