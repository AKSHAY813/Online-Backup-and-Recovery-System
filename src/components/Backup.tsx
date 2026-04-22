import { useState, useEffect, useRef } from 'react';
import { CloudImportModal } from './CloudImportModal';
import { mockApi } from '@/services/mockApi';
import { neuralEngine } from '@/services/neuralEngine';
import type { StorageStats } from '@/types';

export function Backup() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSharding, setIsSharding] = useState(false);
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadStats, setUploadStats] = useState({ speed: '0 MB/s', remaining: '0s', volume: '0 GB / 0 GB' });
  const [showCloudModal, setShowCloudModal] = useState(false);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);
  const [scannedFiles, setScannedFiles] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats, setStats] = useState<StorageStats | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatStorage = (gb: number | undefined) => gb ? (gb >= 1000 ? `${(gb / 1024).toFixed(1)} TB` : `${gb} GB`) : '0 GB';

  useEffect(() => {
    mockApi.getDashboardData().then(data => setStats(data.stats));
    
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
       startSimulatedUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      startSimulatedUpload(files);
    }
  };

  const startSimulatedUpload = async (files: File[]) => {
    // Phase 1: Neural Sharding & Encryption
    setIsSharding(true);
    setCurrentFileName(files[0]?.name || 'Files');
    
    const shards = await neuralEngine.shardAndEncrypt(files[0]);
    console.log('[Neural Mesh] Distributed Shards Verified:', shards);
    setIsSharding(false);

    // Phase 2: Mesh Deployment (Upload)
    setIsUploading(true);
    setProgress(0);
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    
    let uploaded = 0;

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
        // Persist the backup in mock storage with shard data
        mockApi.createBackup(files[0].name, totalSize, (files[0] as any).sourceUrl);
      }
    }, 200);
  };


  return (
    <div className="space-y-10 md:space-y-20 animate-slide-up pb-16">
      {/* AI Status Banner */}
      <div className="glass-dark rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 text-white relative overflow-hidden shard-card group shadow-[0_40px_80px_rgba(0,0,0,0.2)]">
         <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-1000"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
               <svg className="w-10 h-10 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <div className="flex-1">
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <span className="Vault-badge bg-blue-500/20 text-blue-300 border border-white/10">Neural v4.2 Agent</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-neural-pulse"></span>
                     <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Healthy Mesh</span>
                  </div>
               </div>
               <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-[-0.05em] uppercase">Cognitive Guard</h3>
               <p className="text-slate-400 font-medium max-w-2xl text-lg md:text-xl leading-relaxed">
                  Active node established. Sharding protocols are <span className="text-white font-black underline decoration-blue-500 underline-offset-4">optimizing encryption</span> in real-time.
               </p>
            </div>
         </div>
      </div>

      {/* Main Upload Control */}
      <div className="px-2">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10 md:mb-16">
            <div className="text-center md:text-left">
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] uppercase mb-6">
                   {isSharding ? (
                     <>Neural<br /><span className="text-blue-600">Sharding</span></>
                   ) : isUploading ? (
                     <>Syncing<br /><span className="text-blue-500">Node</span></>
                   ) : (
                     <>Storage<br /><span className="text-slate-300">Hub</span></>
                   )}
                </h1>
                {(isUploading || isSharding) && (
                   <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-blue-50 rounded-2xl border border-blue-100">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                     </span>
                     <p className="text-blue-600 font-black text-xs uppercase tracking-widest">{isSharding ? `Processing: ${currentFileName}` : `Deploying: ${currentFileName}`}</p>
                   </div>
                )}
            </div>
            <div className="relative text-center md:text-right group-hover:scale-105 transition-transform duration-500">
               <span className="text-8xl md:text-[12rem] font-black text-slate-900 tracking-[-0.1em] leading-none opacity-[0.03] absolute right-1/2 md:right-0 translate-x-1/2 md:translate-x-0 -top-8 md:-top-16 pointer-events-none select-none">
                  {progress}%
               </span>
               <span className="text-7xl md:text-[10rem] font-black text-blue-600 tracking-[-0.05em] leading-none block relative">
                  {progress}%
               </span>
            </div>
         </div>

         <div className="neural-progress h-4 md:h-6 mb-16 ring-[12px] ring-blue-50/50">
            <div className="neural-progress-bar" style={{ width: `${progress}%` }}></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
               { label: 'Sync Speed', val: isUploading ? uploadStats.speed : '0.0 MB/s', sub: 'RT Transmission' },
               { label: 'Time Remaining', val: isUploading ? uploadStats.remaining : '0s', sub: 'Est Meta-Cycle' },
               { label: 'Payload Hub', val: isUploading ? uploadStats.volume.split(' / ')[0] : '0.0 GB', sub: `Total of ${formatStorage(stats?.total)}` }
            ].map((stat, i) => (
               <div key={i} className="glass-card p-10 rounded-[2.5rem] border-slate-100 text-center shard-card group hover:border-blue-200 transition-all">
                  <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-blue-400 transition-colors uppercase">{stat.label}</p>
                  <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">{stat.val}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{stat.sub}</p>
               </div>
            ))}
         </div>
      </div>

      <input 
        type="file" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
      />

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
         <div className="Vault-card p-10 md:p-14 flex flex-col justify-between min-h-[400px]">
            <div>
               <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-4">Uplink Control</h3>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mb-12 uppercase">Establish Neural Connections</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-8">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="group p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-500 hover:bg-white transition-all text-center flex flex-col items-center gap-6"
               >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 text-white rounded-[1.75rem] flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-all">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-black text-slate-900 text-xs md:text-base tracking-[0.1em] uppercase">Local File</span>
               </button>
               
               <button 
                 onClick={() => setShowCloudModal(true)}
                 className="group p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-500 hover:bg-white transition-all text-center flex flex-col items-center gap-6"
               >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-blue-600 rounded-[1.75rem] border border-slate-100 flex items-center justify-center shadow-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <span className="font-black text-slate-900 text-xs md:text-base tracking-[0.1em] uppercase">Cloud Sync</span>
               </button>
            </div>
         </div>

         <div className="Vault-card p-10 md:p-14 bg-slate-900 text-white flex flex-col justify-between min-h-[400px] border-none shadow-2xl group/sec">
            <div>
               <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase mb-4">Security Protocol</h3>
               <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-12 uppercase">Advanced Cryptographic Feed</p>
            </div>
            
            <div className="space-y-6 flex-1 mb-10">
               <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                     <span className="w-3 h-3 bg-blue-500 rounded-full animate-neural-pulse"></span>
                     <span className="text-xs font-black uppercase tracking-widest uppercase">AES-256 Engine</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-400">ACTIVE</span>
               </div>
               <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                     <span className="w-3 h-3 bg-emerald-500 rounded-full animate-neural-pulse"></span>
                     <span className="text-xs font-black uppercase tracking-widest uppercase">RSA-4096 Shards</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400">SYNCED</span>
               </div>
            </div>

            <button className="btn-neural bg-white/5 hover:bg-white hover:text-slate-900 border border-white/10 w-full transition-all tracking-[0.4em] uppercase">
               Override Security
            </button>
         </div>
      </div>

      {/* Categorized Assets */}
      <div className="Vault-card overflow-hidden">
        <div className="px-8 md:px-14 py-10 md:py-14 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between bg-slate-50/50 gap-10">
           <div>
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-[-0.05em] uppercase">Detected Shards</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 uppercase">Neural Scan Results</p>
           </div>
           <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 scrollbar-hide">
              {['all', 'video', 'document', 'download'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${
                    activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                    : 'bg-white text-slate-400 border border-slate-100 opacity-60 hover:opacity-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
        <div className="divide-y divide-slate-100">
           {scannedFiles.filter(item => activeCategory === 'all' || item.category === activeCategory).map((item, i) => (
             <div key={i} className="px-8 md:px-14 py-8 md:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between group hover:bg-blue-50/30 transition-all gap-8">
                <div className="flex items-center gap-8">
                   <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-lg shrink-0 ${
                      item.category === 'video' ? 'bg-blue-50 text-blue-600' :
                      item.category === 'document' ? 'bg-emerald-50 text-emerald-600' :
                      item.category === 'download' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                   } group-hover:scale-110 transition-transform duration-500`}>
                      {item.category === 'video' ? (
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      ) : (
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      )}
                   </div>
                   <div>
                      <p className="font-black text-slate-900 text-lg md:text-2xl leading-none tracking-tighter mb-3 uppercase group-hover:text-blue-600 transition-colors">{item.name}</p>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{item.category}</span>
                         <span className="w-1.5 h-1.5 bg-blue-100 rounded-full"></span>
                         <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-10">
                   <p className="text-xl md:text-3xl font-black text-slate-900 tabular-nums tracking-tighter uppercase">{item.size}</p>
                   <button 
                     onClick={() => {
                        const file = new File([""], item.name, { type: "text/plain" });
                        (file as any).simulatedSize = item.size;
                        startSimulatedUpload([file]);
                     }}
                     className="btn-neural btn-neural-primary !px-8 !py-4 transition-all uppercase"
                   >
                     Deploy
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
