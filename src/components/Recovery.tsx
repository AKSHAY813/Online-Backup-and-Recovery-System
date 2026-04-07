import { useState, useEffect } from 'react';
import { mockApi } from '@/services/mockApi';
import type { BackupItem } from '@/types';

export function Recovery() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const toggleFileSelection = (id: string) => {
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
    <div className="space-y-12 animate-slide-up pb-32">
      <div className="px-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">Neural<br /><span className="text-emerald-600">Recovery.</span></h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Retrieved Shards from Global Hub</p>
           </div>
           <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-slate-100 shadow-sm">
              <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">Successfully Recovered</button>
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
                 onClick={() => toggleFileSelection(file.id)}
                 className={`sentinel-card p-8 flex flex-col justify-between cursor-pointer group transition-all duration-500 ${
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
                       {iconType === 'pdf' && (
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                         </svg>
                       )}
                       {iconType === 'doc' && (
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                         </svg>
                       )}
                       {iconType === 'archive' && (
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                       )}
                    </div>
                    <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                       selectedFiles.includes(file.id) ? 'bg-emerald-600 border-emerald-600 shadow-lg shadow-emerald-500/40' : 'border-slate-100 bg-white group-hover:border-slate-300'
                    }`}>
                       {selectedFiles.includes(file.id) && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                       )}
                    </div>
                 </div>
                 <div>
                    <p className="font-black text-slate-900 text-xl tracking-tight mb-2 group-hover:text-emerald-600 transition-colors uppercase truncate leading-none">{file.name}</p>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{file.size}</span>
                       <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none font-bold">SHA-256 OK</span>
                    </div>
                 </div>
              </div>
             );
           })}
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedFiles.length > 0 && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
            <div className="glass-dark rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-emerald-900/40 border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
               <div className="flex items-center gap-6 px-4">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-2xl bg-emerald-600 border-2 border-[#0F172A] flex items-center justify-center text-white text-[10px] font-black">
                           {i}
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

