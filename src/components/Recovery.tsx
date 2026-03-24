import { useState } from 'react';

const recoveryFiles = [
  { id: '1', name: 'Design_Final.fig', type: 'figma', size: '25.4 MB', date: 'Mar 12, 2024' },
  { id: '2', name: 'Presentation.pdf', type: 'pdf', size: '12.8 MB', date: 'Mar 11, 2024' },
  { id: '3', name: 'Project_Assets.zip', type: 'archive', size: '480 MB', date: 'Mar 10, 2024' },
  { id: '4', name: 'Profile_Photo.png', type: 'image', size: '2.4 MB', date: 'Mar 09, 2024' },
  { id: '5', name: 'Dashboard_Mockup.png', type: 'image', size: '3.8 MB', date: 'Mar 09, 2024' },
  { id: '6', name: 'Annual_Report.docx', type: 'doc', size: '1.2 MB', date: 'Mar 08, 2024' },
];

export function Recovery() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>(['1', '2']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      <div className="px-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">Encrypted<br /><span className="text-blue-600">Assets.</span></h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.2em]">Verified Shards in Local Node</p>
           </div>
           <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-3xl border border-slate-100 shadow-sm">
              <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm ring-1 ring-slate-100">All Files</button>
              <button className="px-6 py-3 text-slate-400 hover:text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">Shared</button>
              <button className="px-6 py-3 text-slate-400 hover:text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors">Trash</button>
           </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-12 group">
           <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-[3rem] group-focus-within:bg-blue-600/10 transition-colors"></div>
           <div className="relative flex items-center bg-white border border-slate-200 rounded-[2.5rem] px-8 h-20 shadow-premium focus-within:ring-4 focus-within:ring-blue-100/50 focus-within:border-blue-400 transition-all">
              <svg className="w-6 h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                 type="text"
                 placeholder="Search your distributed vault for shards, files, or nodes..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent border-none outline-none ml-6 text-lg text-slate-700 placeholder:text-slate-300 font-bold"
              />
              <div className="hidden md:flex items-center gap-2">
                 <kbd className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400">⌘</kbd>
                 <kbd className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400">K</kbd>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between mb-8 px-6">
           <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Total Index: {recoveryFiles.length} Nodes</p>
           <div className="flex items-center gap-4">
              <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">{selectedFiles.length} Shards Targetted</span>
              <div className="w-px h-4 bg-slate-200"></div>
              <button className="text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] transition-colors">Select All</button>
           </div>
        </div>

        {/* File List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {recoveryFiles.map((file) => (
             <div 
                key={file.id} 
                onClick={() => toggleFileSelection(file.id)}
                className={`sentinel-card p-8 flex flex-col justify-between cursor-pointer group transition-all duration-500 ${
                   selectedFiles.includes(file.id) ? 'ring-4 ring-blue-500/10 border-blue-500 bg-blue-50/20' : 'bg-white'
                }`}
             >
                <div className="flex items-start justify-between mb-8">
                   <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ${
                      file.type === 'image' ? 'bg-rose-50 text-rose-500' :
                      file.type === 'pdf' ? 'bg-orange-50 text-orange-500' :
                      file.type === 'figma' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-600'
                   }`}>
                      {file.type === 'image' && (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                      {(file.type === 'pdf' || file.type === 'doc') && (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {file.type === 'figma' && (
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.5 11c1.933 0 3.5-1.567 3.5-3.5S10.433 4 8.5 4 5 5.567 5 7.5 6.567 11 8.5 11zM15.5 11c1.933 0 3.5-1.567 3.5-3.5S17.433 4 15.5 4 12 5.567 12 7.5s1.567 3.5 3.5 3.5zM8.5 18c1.933 0 3.5-1.567 3.5-3.5 0-1.933-1.567-3.5-3.5-3.5S5 12.567 5 14.5 6.567 18 8.5 18zM15.5 18c1.933 0 3.5-1.567 3.5-3.5 0-1.933-1.567-3.5-3.5-3.5S12 12.567 12 14.5s1.567 3.5 3.5 3.5zM8.5 24c1.933 0 3.5-1.567 3.5-3.5S10.433 17 8.5 17 5 18.567 5 20.5 6.567 24 8.5 24z" />
                         </svg>
                      )}
                      {file.type === 'archive' && (
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                         </svg>
                      )}
                   </div>
                   <div className={`w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                      selectedFiles.includes(file.id) ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/40' : 'border-slate-100 bg-white group-hover:border-slate-300'
                   }`}>
                      {selectedFiles.includes(file.id) && (
                         <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                         </svg>
                      )}
                   </div>
                </div>
                <div>
                   <p className="font-black text-slate-900 text-xl tracking-tight mb-2 group-hover:text-blue-600 transition-colors uppercase truncate">{file.name}</p>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{file.size}</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{file.date}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedFiles.length > 0 && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
            <div className="glass-dark rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl shadow-blue-900/40 border border-white/10 animate-in slide-in-from-bottom-10 duration-700">
               <div className="flex items-center gap-6 px-4">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="w-10 h-10 rounded-2xl bg-blue-600 border-2 border-[#0F172A] flex items-center justify-center text-white text-[10px] font-black">
                           {i}
                        </div>
                     ))}
                  </div>
                  <div>
                     <p className="text-white font-black text-sm tracking-tight leading-none mb-1.5">{selectedFiles.length} Shards Targetted</p>
                     <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Awaiting Batch Uplink</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <button className="p-4 text-slate-400 hover:text-white transition-colors">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                  </button>
                  <button className="flex items-center gap-4 px-8 py-5 bg-blue-600 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-[1.02] active:scale-95 transition-all group">
                     Deploy Shards
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
