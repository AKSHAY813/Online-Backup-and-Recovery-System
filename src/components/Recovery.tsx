import { useState, useEffect } from 'react';
import { mockApi } from '@/services/mockApi';
import type { BackupItem } from '@/types';

interface BackupVersion {
  id: string;
  timestamp: string;
  size: string;
  hash: string;
  node: string;
}

export function Recovery() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectingFile, setInspectingFile] = useState<BackupItem | null>(null);
  const [versions, setVersions] = useState<BackupVersion[]>([]);
  const [isVersionsLoading, setIsVersionsLoading] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await mockApi.getDashboardData();
        setBackups(data.recentBackups);
      } catch (error) {
        console.error('Failed to load backups for recovery:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleInspectFile = async (file: BackupItem) => {
    setInspectingFile(file);
    setIsVersionsLoading(true);
    try {
      const history = await (mockApi as any).getFileVersions(file.id);
      setVersions(history);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setIsVersionsLoading(false);
    }
  };

  const handleRestoreVersion = (vId: string) => {
    setRestoringVersion(vId);
    setTimeout(() => {
        setRestoringVersion(null);
        setInspectingFile(null);
        alert('Neural restoration complete. Shard deployed to local node.');
    }, 2500);
  };

  const toggleFileSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getIconForType = (name: string, type: string) => {
    const n = name.toLowerCase();
    if (n.endsWith('.docx') || n.endsWith('.doc')) return 'doc';
    if (n.endsWith('.pdf')) return 'pdf';
    if (n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg')) return 'image';
    if (n.endsWith('.zip') || n.endsWith('.archive')) return 'archive';
    return type;
  };

  if (isLoading) {
    return (
      <div className="space-y-12 animate-pulse pb-32">
        <div className="h-20 w-3/4 bg-slate-200 rounded-3xl mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-[2.5rem]"></div>)}
        </div>
      </div>
    );
  }

  const filteredBackups = backups.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-12 animate-slide-up pb-32 relative">
      <div className="px-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">Neural<br /><span className="text-emerald-600">Recovery.</span></h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Retrieved Shards from Global Hub</p>
           </div>
           <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-slate-100 shadow-sm">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">Verified Assets</button>
              <button className="px-6 py-3 text-slate-400 hover:text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors font-bold uppercase transition-all">Vault Stream</button>
           </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-12 group">
           <div className="absolute inset-0 bg-emerald-600/5 blur-2xl rounded-[3rem] group-focus-within:bg-emerald-600/10 transition-colors"></div>
           <div className="relative flex items-center bg-white border border-slate-200 rounded-[2.5rem] px-8 h-20 shadow-premium focus-within:ring-4 focus-within:ring-emerald-100/50 focus-within:border-emerald-400 transition-all">
              <svg className="w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                 type="text"
                 placeholder="Search recovered shards for local deployment..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent border-none outline-none ml-6 text-lg text-slate-700 placeholder:text-slate-300 font-bold"
              />
           </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-6">
           <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Verified Recoveries: {filteredBackups.length} Nodes</p>
           <div className="flex items-center gap-4">
              <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] font-['Outfit']">{selectedFiles.length} Shards Selected</span>
           </div>
        </div>

        {/* File List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredBackups.map((file) => {
             const iconType = getIconForType(file.name, file.type);
             return (
              <div 
                 key={file.id} 
                 onClick={() => handleInspectFile(file)}
                 className={`sentinel-card p-8 flex flex-col justify-between cursor-pointer group transition-all duration-500 hover:border-emerald-400 ${
                    selectedFiles.includes(file.id) ? 'ring-4 ring-emerald-500/10 border-emerald-500 bg-emerald-50/20' : 'bg-white'
                 }`}
              >
                 <div className="flex items-start justify-between mb-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ${
                       iconType === 'image' ? 'bg-rose-50 text-rose-500' :
                       iconType === 'pdf' ? 'bg-orange-50 text-orange-500' :
                       iconType === 'doc' ? 'bg-[#0052A1]/10 text-[#0052A1]' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                       {iconType === 'image' && (
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                         </svg>
                       )}
                       {iconType === 'pdf' ? (
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                       ) : iconType === 'doc' ? (
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                       ) : null}
                    </div>
                    <div 
                        onClick={(e) => toggleFileSelection(file.id, e)}
                        className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                        selectedFiles.includes(file.id) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-500/40' : 'border-slate-100 bg-white group-hover:border-slate-300'
                        }`}
                    >
                       {selectedFiles.includes(file.id) && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                       )}
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <p className="font-black text-slate-900 text-xl tracking-tight group-hover:text-emerald-600 transition-colors uppercase truncate leading-none">{file.name}</p>
                       <span className="px-2 py-0.5 bg-slate-100 text-[8px] font-black rounded uppercase text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">{file.versions}v</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{file.size}</span>
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none font-bold">ACTIVE HUB</span>
                       </div>
                       <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors opacity-0 group-hover:opacity-100">Timeline →</button>
                    </div>
                 </div>
              </div>
             );
           })}
        </div>
      </div>

      {/* Point-in-Time Recovery Overlay (Neural Timeline) */}
      {inspectingFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end animate-fade-in p-6">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setInspectingFile(null)}></div>
            <div className="relative w-full max-w-xl h-full bg-[#0F172A] rounded-[3rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-slide-right">
                <div className="p-10 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <span className="sentinel-badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20 mb-4 block w-fit">Point-in-Time Access</span>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-none truncate max-w-md">{inspectingFile.name}</h2>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-3">Neural history indexed from 3 Global Nodes</p>
                        </div>
                        <button onClick={() => setInspectingFile(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Versions</p>
                            <p className="text-2xl font-black text-white">{inspectingFile.versions}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Latest Size</p>
                            <p className="text-2xl font-black text-emerald-400">{inspectingFile.size}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Shard</p>
                            <p className="text-2xl font-black text-white">{new Date(inspectingFile.lastBackup).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em]">Historical Timeline</h3>
                    </div>

                    {isVersionsLoading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-[2rem]"></div>)}
                        </div>
                    ) : (
                        <div className="space-y-4 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent"></div>
                            
                            {versions.map((version, i) => (
                                <div key={version.id} className={`relative pl-12 group ${restoringVersion === version.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {/* Timeline Node */}
                                    <div className={`absolute left-[21px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-4 transition-all duration-500 ${
                                        i === 0 ? 'bg-emerald-500 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-125' : 'bg-slate-700 ring-slate-800 group-hover:bg-emerald-400'
                                    }`}></div>

                                    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 hover:bg-white/[0.08] hover:border-white/10 transition-all group flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-black text-lg tracking-tight mb-1">Version {versions.length - i}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(version.timestamp).toLocaleString()}</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full text-slate-500">•</span>
                                                <span className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest">{version.node}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-sm mb-3">{version.size}</p>
                                            <button 
                                                onClick={() => handleRestoreVersion(version.id)}
                                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 active:scale-95"
                                            >
                                                {restoringVersion === version.id ? (
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                        Syncing...
                                                    </span>
                                                ) : 'Rewind Now'}
                                            </button>
                                        </div>
                                    </div>
                                    {restoringVersion === version.id && (
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <div className="bg-emerald-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest animate-bounce">
                                                Restoring Shard Data...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-10 bg-white/5 border-t border-white/5">
                    <div className="flex items-center gap-4 text-slate-400">
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                            All historical shards are encrypted with your Master Key (AES-256) and sharded via Neural Compression Protocol.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Floating Action Bar */}
      {selectedFiles.length > 0 && !inspectingFile && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
            <div className="glass-dark rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-emerald-900/40 border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
               <div className="flex items-center gap-6 px-4">
                  <div className="flex -space-x-3">
                     {selectedFiles.slice(0, 3).map((id, i) => (
                        <div key={id} className="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-[#0F172A] flex items-center justify-center text-white text-[10px] font-black">
                           {i + 1}
                        </div>
                     ))}
                  </div>
                  <div>
                     <p className="text-white font-black text-sm tracking-tight leading-none mb-1.5">{selectedFiles.length} Shards Targetted</p>
                     <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest">Ready for Local Restore</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="flex items-center gap-4 px-8 py-5 bg-emerald-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all group font-bold">
                     Restore Internally
                     <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

