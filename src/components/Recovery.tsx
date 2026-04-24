import { useState, useEffect } from 'react';
import { mockApi } from '@/services/mockApi';
import type { BackupItem } from '@/types';
import { useToast } from '@/context/ToastContext';

interface BackupVersion {
  id: string;
  timestamp: string;
  size: string;
  hash: string;
  node: string;
}

export function Recovery() {
  const { showToast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inspectingFile, setInspectingFile] = useState<BackupItem | null>(null);
  const [versions, setVersions] = useState<BackupVersion[]>([]);
  const [isVersionsLoading, setIsVersionsLoading] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<BackupItem | null>(null);
  const [vaultMode, setVaultMode] = useState<'verified' | 'vault'>('verified');
  const [showPasskeyModal, setShowPasskeyModal] = useState<{ isOpen: boolean; mode: 'set' | 'verify'; file: BackupItem | null }>({ isOpen: false, mode: 'set', file: null });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

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

  const handleRestoreVersion = async (vId: string) => {
    setRestoringVersion(vId);
    showToast('Reassembling neural shards...', 'info');
    
    try {
      if (inspectingFile) {
        await mockApi.restoreBackup(inspectingFile.id);
      }
      setTimeout(() => {
          setRestoringVersion(null);
          setInspectingFile(null);
          showToast('Shard reassembly complete! File restored.', 'success');
          loadData();
      }, 2500);
    } catch (error) {
      console.error('Restore failed:', error);
      setRestoringVersion(null);
      showToast('Failed to restore shard', 'error');
    }
  };

  const handleDeleteFile = async (id: string, name: string) => {
    if (confirm(`Purge ${name} from the neural mesh? This cannot be undone.`)) {
      try {
        await mockApi.deleteBackup(id);
        showToast(`${name} purged successfully`, 'success');
        loadData();
      } catch (error) {
        console.error('Delete failed:', error);
        showToast('Failed to purge shard', 'error');
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedFiles.length === 0) return;
    if (confirm(`Purge ${selectedFiles.length} selected shards from the neural mesh?`)) {
        try {
          for (const id of selectedFiles) {
            await mockApi.deleteBackup(id);
          }
          showToast(`${selectedFiles.length} shards purged from mesh hub!`, 'success');
          setSelectedFiles([]);
          loadData();
        } catch (error) {
          console.error('Batch delete failed:', error);
          showToast('Failed to purge some shards', 'error');
        }
    }
  };

  const handleOpenFile = (file: BackupItem) => {
    if (!file.isRestored) {
        showToast('Shard must be reassembled before opening', 'info');
        handleInspectFile(file);
        return;
    }
    
    if (file.isVaulted && vaultMode === 'vault') {
        setShowPasskeyModal({ isOpen: true, mode: 'verify', file });
        return;
    }
    
    setPreviewFile(file);
    showToast(`Initializing Neural Link: ${file.name}`, 'success');
  };

  const handleVaultSecure = (file: BackupItem) => {
    setShowPasskeyModal({ isOpen: true, mode: 'set', file });
  };

  const handlePasskeySubmit = async () => {
    if (!showPasskeyModal.file || !passkeyInput) return;
    
    try {
        if (showPasskeyModal.mode === 'set') {
            await (mockApi as any).moveToVault(showPasskeyModal.file.id, passkeyInput);
            showToast(`${showPasskeyModal.file.name} secured in Vault`, 'success');
            loadData();
            setShowPasskeyModal({ isOpen: false, mode: 'set', file: null });
            setPasskeyInput('');
        } else {
            const success = await (mockApi as any).verifyVaultPasskey(showPasskeyModal.file.id, passkeyInput);
            if (success) {
                setPreviewFile(showPasskeyModal.file);
                setShowPasskeyModal({ isOpen: false, mode: 'verify', file: null });
                setPasskeyInput('');
                setPasskeyError('');
            }
        }
    } catch (error: any) {
        setPasskeyError(error.message || 'Verification failed');
        if (error.message.includes('attempts') || error.message.includes('Lockout')) {
            setTimeout(() => {
                setShowPasskeyModal({ isOpen: false, mode: 'verify', file: null });
                setPasskeyInput('');
                setPasskeyError('');
            }, 3000);
        }
    }
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
        <div className="h-24 w-3/4 bg-slate-200 rounded-[2rem] mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[3rem]"></div>)}
        </div>
      </div>
    );
  }

  const filteredBackups = backups.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVault = vaultMode === 'vault' ? f.isVaulted : !f.isVaulted;
    return matchesSearch && matchesVault;
  });

  return (
    <div className="space-y-12 animate-slide-up pb-32 relative">
      <div className="px-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 md:mb-20">
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                 <span className="Vault-badge bg-blue-50 text-blue-600 border-blue-100">Recovery Agent v4.2</span>
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-neural-pulse"></span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-[-0.05em] leading-[0.9] uppercase">
                 Neural<br /><span className="text-blue-600">Recovery</span>
              </h1>
              <p className="text-slate-400 font-black text-xs md:text-sm uppercase tracking-[0.4em] mt-6 uppercase">Extract Shards from Mesh Hub</p>
           </div>
           <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xl p-3 rounded-[2rem] border border-blue-50 shadow-2xl self-center md:self-auto">
              <button 
                onClick={() => setVaultMode('verified')}
                className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${vaultMode === 'verified' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Verified
              </button>
              <button 
                onClick={() => setVaultMode('vault')}
                className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${vaultMode === 'vault' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/30' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Vault
              </button>
           </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-20 group">
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
           <div className="relative flex items-center bg-white border border-slate-100 rounded-[2.5rem] px-10 h-24 shadow-2xl focus-within:ring-8 focus-within:ring-blue-100/50 transition-all">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                 type="text"
                 placeholder="Locate Neural Shard Index..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-transparent border-none outline-none ml-8 text-xl text-slate-700 placeholder:text-slate-300 font-extrabold uppercase tracking-tight"
              />
              <div className="hidden md:flex items-center gap-3">
                 <span className="bg-slate-50 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">CMD+K</span>
              </div>
           </div>
        </div>

        {/* Recently Restored Section */}
        {backups.some(b => b.isRestored) && (
          <div className="mb-20">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recently Restored</h2>
             </div>
             <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                {backups.filter(b => b.isRestored).sort((a, b) => new Date(b.restoredAt || 0).getTime() - new Date(a.restoredAt || 0).getTime()).map(file => (
                  <div 
                    key={`restored-${file.id}`} 
                    onClick={() => handleOpenFile(file)}
                    className="min-w-[300px] bg-white rounded-[2rem] p-8 border border-blue-100 shadow-xl flex items-center gap-6 cursor-pointer hover:scale-105 hover:border-blue-300 transition-all group"
                  >
                     <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <div className="flex-1">
                        <p className="font-black text-slate-900 uppercase tracking-tight truncate w-32">{file.name}</p>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">Restored {new Date(file.restoredAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                     </div>
                     <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-10 px-8">
           <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Index Capacity: {filteredBackups.length} Shards</p>
           {selectedFiles.length > 0 && (
             <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">{selectedFiles.length} Selected</span>
           )}
        </div>

        {/* File List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
           {filteredBackups.map((file) => {
             const iconType = getIconForType(file.name, file.type);
             const isSelected = selectedFiles.includes(file.id);
             return (
              <div 
                 key={file.id} 
                 onClick={() => handleInspectFile(file)}
                 className={`Vault-card p-10 flex flex-col justify-between cursor-pointer group transition-all duration-500 shard-card ${
                    isSelected ? 'ring-8 ring-blue-100 border-blue-400' : ''
                 }`}
              >
                 <div className="flex items-start justify-between mb-12">
                    <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${
                       iconType === 'image' ? 'bg-rose-50 text-rose-500' :
                       iconType === 'pdf' ? 'bg-orange-50 text-orange-500' :
                       iconType === 'doc' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                       {iconType === 'image' && (
                         <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                       )}
                       {(iconType === 'pdf' || iconType === 'doc') && (
                         <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                       )}
                       {iconType === 'archive' && (
                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                       )}
                    </div>
                    <div 
                        onClick={(e) => toggleFileSelection(file.id, e)}
                        className={`w-10 h-10 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${
                        isSelected ? 'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/40' : 'border-slate-50 bg-slate-50 group-hover:border-blue-100'
                        }`}
                    >
                       {isSelected && (
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                       )}
                    </div>
                 </div>
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                       <p className="font-extrabold text-slate-900 text-2xl tracking-tighter uppercase group-hover:text-blue-600 transition-colors truncate">{file.name}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.size}</span>
                          <span className="w-1.5 h-1.5 bg-blue-100 rounded-full"></span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteFile(file.id, file.name); }}
                            className="text-[9px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors"
                          >
                            Purge
                          </button>
                       </div>
                       <div className="flex items-center gap-2">
                           {vaultMode === 'verified' && (
                               <button 
                                 onClick={(e) => { e.stopPropagation(); handleVaultSecure(file); }}
                                 className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all border border-slate-100"
                                 title="Secure in Vault"
                               >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                               </button>
                           )}
                           <div className={`flex items-center gap-1.5 px-3 py-1 ${file.isRestored ? (vaultMode === 'vault' ? 'bg-slate-900 text-white border-slate-900' : 'bg-blue-50 text-blue-600 border-blue-100') + ' cursor-pointer hover:scale-105' : 'bg-emerald-50 text-emerald-600 border-emerald-100'} rounded-full text-[9px] font-black uppercase tracking-widest border transition-all`}
                                onClick={(e) => { if (file.isRestored) { e.stopPropagation(); handleOpenFile(file); } }}
                           >
                              {file.isRestored ? (vaultMode === 'vault' ? 'Unlock & Open' : 'Open Asset') : 'Active'}
                           </div>
                       </div>
                     </div>
                 </div>
              </div>
             );
           })}
        </div>
      </div>

      {/* Point-in-Time access Sheet */}
      {inspectingFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setInspectingFile(null)}></div>
            <div className="relative w-full max-w-2xl h-full glass-dark rounded-[3.5rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-slide-right">
                <div className="p-12 md:p-16 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div className="max-w-[80%]">
                            <span className="Vault-badge bg-blue-500/20 text-blue-400 border-white/10 mb-6 block w-fit">Temporal Shard Access</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.05em] uppercase leading-[0.9]">{inspectingFile.name}</h2>
                        </div>
                        <button onClick={() => setInspectingFile(null)} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 relative z-10">
                        {[
                           { l: 'Snapshots', v: inspectingFile.versions },
                           { l: 'Encryption', v: 'AES-256' },
                           { l: 'Health', v: '99.9%' }
                        ].map((stat, i) => (
                          <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center md:text-left">
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{stat.l}</p>
                              <p className="text-xl md:text-2xl font-black text-white tracking-tight">{stat.v}</p>
                          </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 md:p-16 space-y-10 scrollbar-hide">
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-neural-pulse"></div>
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] uppercase">Neural Timeline Feed</h3>
                    </div>

                    {isVersionsLoading ? (
                        <div className="space-y-6 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-white/5 rounded-[2.5rem]"></div>)}
                        </div>
                    ) : (
                        <div className="space-y-6 relative">
                            <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent"></div>
                            {versions.map((version, i) => (
                                <div key={version.id} className={`relative pl-20 group ${restoringVersion === version.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className={`absolute left-[26px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full ring-8 transition-all duration-700 ${
                                        i === 0 ? 'bg-blue-500 ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.8)] scale-125' : 'bg-slate-700 ring-slate-800'
                                    }`}></div>

                                    <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 hover:bg-white/[0.08] hover:border-white/10 transition-all flex flex-col sm:flex-row items-center justify-between gap-8">
                                        <div className="text-center sm:text-left">
                                            <p className="text-white font-black text-xl tracking-tight mb-2 uppercase">Cycle {versions.length - i}</p>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(version.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleRestoreVersion(version.id)}
                                            className="btn-neural bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 w-full sm:w-auto"
                                        >
                                            {restoringVersion === version.id ? 'SYNCING...' : 'RESTORE'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-12 md:p-14 bg-white/5 border-t border-white/5 backdrop-blur-3xl">
                    <div className="flex items-start gap-6">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                           Shards are reassembled using <span className="text-white">Cognitive Parity</span> checks to ensure 100% data integrity before local deployment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Floating Action Controller */}
      {selectedFiles.length > 0 && !inspectingFile && (
         <div className="fixed bottom-24 md:bottom-12 left-0 right-0 z-50 px-8 animate-slide-up">
            <div className="max-w-3xl mx-auto glass-dark rounded-[3rem] p-4 md:p-6 flex items-center justify-between shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 border-t-white/20">
               <div className="flex items-center gap-6 px-6">
                  <div className="flex -space-x-4">
                     {selectedFiles.slice(0, 3).map((id, i) => (
                        <div key={id} className={`w-12 h-12 rounded-[1.25rem] bg-blue-600 border-4 border-slate-900 flex items-center justify-center text-white text-xs font-black shadow-2xl transform hover:-translate-y-2 transition-transform`}>
                           {i + 1}
                        </div>
                     ))}
                     {selectedFiles.length > 3 && (
                        <div className="w-12 h-12 rounded-[1.25rem] bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-slate-400 text-xs font-black">
                           +{selectedFiles.length - 3}
                        </div>
                     )}
                  </div>
                  <div>
                     <p className="text-white font-black text-lg tracking-tighter leading-none mb-1 uppercase">{selectedFiles.length} SHARDS</p>
                     <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.3em]">Queued for Deployment</p>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <button 
                    onClick={handleDeleteSelected}
                    className="px-6 py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Purge
                  </button>
                  <button 
                    onClick={() => {
                        showToast(`Initiating restoration for ${selectedFiles.length} files...`, 'info');
                        setTimeout(() => showToast('Batch restoration complete!', 'success'), 3000);
                        setSelectedFiles([]);
                    }}
                    className="btn-neural btn-neural-primary !px-12 !py-6 flex items-center gap-4 group"
                  >
                    <span>Restore ALL</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-fade-in">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setPreviewFile(null)}></div>
            <div className="relative w-full max-w-5xl h-[80vh] glass-dark rounded-[4rem] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-slide-up">
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </div>
                        <div>
                            <p className="text-white font-black text-xl tracking-tight uppercase leading-none mb-1">{previewFile.name}</p>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] uppercase">Neural Link Established • Verified Payload</p>
                        </div>
                    </div>
                    <button onClick={() => setPreviewFile(null)} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-hidden p-10 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <p className="text-[200px] font-black text-white/10 rotate-12 select-none uppercase">VAULT MESH</p>
                    </div>
                    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-slate-950 flex items-center justify-center">
                        {/* Intelligent Type Analyzer & Renderer */}
                        {(() => {
                            const name = previewFile.name.toLowerCase();
                            const isImage = previewFile.type === 'image' || name.match(/\.(jpg|jpeg|png|webp|gif)$/i);
                            const isVideo = previewFile.type === 'video' || name.match(/\.(mp4|mov|avi|mkv)$/i);
                            const isCode = name.match(/\.(ts|tsx|js|jsx|json|py|html|css|txt)$/i);
                            
                            if (isImage) {
                                return (
                                    <img src="file:///C:/Users/AKSHAY/.gemini/antigravity/brain/eaddc823-ed8b-48df-b94d-e2d0e7fc9811/mock_image_preview_1776975245777.png" 
                                         alt="Neural Image Stream" 
                                         className="w-full h-full object-cover animate-fade-in"
                                    />
                                );
                            }
                            
                            if (isVideo) {
                                return (
                                    <div className="w-full h-full relative group">
                                        <img src="file:///C:/Users/AKSHAY/.gemini/antigravity/brain/eaddc823-ed8b-48df-b94d-e2d0e7fc9811/mock_video_preview_1776976957218.png" 
                                             alt="Neural Video Stream" 
                                             className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                                            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 animate-neural-pulse cursor-pointer">
                                                <svg className="w-16 h-16 text-white ml-2" fill="currentColor" viewBox="0 0 20 20"><path d="M4.5 3.5l11 6.5-11 6.5V3.5z" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            
                            if (isCode) {
                                return (
                                    <div className="w-full h-full p-0 overflow-hidden bg-[#0d1117]">
                                        <img src="file:///C:/Users/AKSHAY/.gemini/antigravity/brain/eaddc823-ed8b-48df-b94d-e2d0e7fc9811/mock_code_preview_1776976978795.png" 
                                             alt="Neural Code Shard" 
                                             className="w-full h-full object-contain"
                                        />
                                    </div>
                                );
                            }
                            
                            // Default to Document view
                            return (
                                <div className="w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden animate-fade-in">
                                    <img src="file:///C:/Users/AKSHAY/.gemini/antigravity/brain/eaddc823-ed8b-48df-b94d-e2d0e7fc9811/mock_document_preview_1776975218545.png" 
                                         className="w-full h-full object-contain" 
                                         alt="Document View" 
                                    />
                                </div>
                            );
                        })()}
                    </div>
                </div>

                <div className="px-10 py-10 bg-black/20 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all">Download Shard</button>
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5 transition-all">Export JSON</button>
                    </div>
                    <div className="text-right">
                        <p className="text-white font-black text-lg tracking-tighter uppercase leading-none mb-1">{previewFile.size}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cognitive Parity Check: 100%</p>
                    </div>
                </div>
            </div>
        </div>
      )}
      {/* Vault Passkey Modal */}
      {showPasskeyModal.isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-fade-in">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowPasskeyModal({ ...showPasskeyModal, isOpen: false })}></div>
              <div className="relative w-full max-w-md bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
                  <div className="p-10 text-center">
                      <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">{showPasskeyModal.mode === 'set' ? 'Set Vault Passkey' : 'Enter Vault Passkey'}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">{showPasskeyModal.file?.name}</p>
                      
                      <div className="space-y-4">
                          <input 
                            type="password"
                            placeholder="••••••••"
                            value={passkeyInput}
                            onChange={(e) => setPasskeyInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handlePasskeySubmit()}
                            autoFocus
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-center text-2xl tracking-[0.5em] focus:ring-8 focus:ring-blue-100 outline-none transition-all"
                          />
                          {passkeyError && (
                              <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest animate-shake">{passkeyError}</p>
                          )}
                          <button 
                            onClick={handlePasskeySubmit}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl shadow-slate-900/20"
                          >
                            {showPasskeyModal.mode === 'set' ? 'Seal Vault' : 'Unlock Shard'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
