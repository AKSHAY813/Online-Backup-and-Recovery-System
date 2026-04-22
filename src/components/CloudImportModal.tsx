import { useState, useEffect } from 'react';

interface CloudImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (files: File[]) => void;
}

export function CloudImportModal({ isOpen, onClose, onImport }: CloudImportModalProps) {
  const [activeTab, setActiveTab] = useState<'providers' | 'files'>('providers');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCloudFiles, setSelectedCloudFiles] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<any[]>([]);

  const defaultDriveFiles = [
    { id: '1', name: 'Project_Alpha_Specs.pdf', size: '2.4 MB', type: 'pdf', date: '2025-10-24' },
    { id: '2', name: 'UI_Assets_Final.zip', size: '84.1 MB', type: 'zip', date: '2025-10-23' },
    { id: '3', name: 'Quarterly_Report_Q3.xlsx', size: '1.1 MB', type: 'excel', date: '2025-10-20' },
    { id: '4', name: 'Client_Meeting_Recording.mp4', size: '245.8 MB', type: 'video', date: '2025-10-18' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab('providers');
        setSelectedProvider(null);
        setIsConnecting(false);
        setSelectedCloudFiles([]);
        setUrlInput('');
        setIsFetchingUrl(false);
        setCurrentFiles([]);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    setCurrentFiles(defaultDriveFiles);
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setActiveTab('files');
    }, 1500);
  };

  const handleUrlFetch = () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    
    const urlParts = urlInput.split('/');
    const possibleName = urlParts[urlParts.length - 1];
    let fileName = possibleName && possibleName.includes('.') ? possibleName.split('?')[0] : 'Web_Node_Payload.pdf';
    
    setTimeout(() => {
      setIsFetchingUrl(false);
      setSelectedProvider('Direct Node');
      const newFile = {
        id: 'url_' + Date.now(),
        name: fileName,
        size: (Math.random() * 15 + 1).toFixed(1) + ' MB',
        type: 'web',
        date: new Date().toISOString().split('T')[0],
        url: urlInput
      };
      setCurrentFiles([newFile]);
      setSelectedCloudFiles([newFile.id]);
      setActiveTab('files');
    }, 1500);
  };

  const toggleFileSelection = (id: string) => {
    setSelectedCloudFiles(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleImportSubmit = () => {
    const filesToImport = selectedCloudFiles.map(id => {
      const fileData = currentFiles.find(f => f.id === id);
      const sizeInBytes = parseFloat(fileData?.size || '1') * 1024 * 1024;
      const mockFile = new File(["mock"], fileData?.name || "Imported_File", { type: "application/octet-stream" });
      Object.defineProperty(mockFile, 'size', { value: sizeInBytes, writable: false });
      const sourceUrl = fileData?.url || (selectedProvider ? `https://${selectedProvider.toLowerCase()}.com/v/${id}` : '');
      Object.defineProperty(mockFile, 'sourceUrl', { value: sourceUrl, writable: false });
      return mockFile;
    });

    onImport(filesToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 md:p-6 lg:p-10">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      
      <div className="bg-white rounded-t-[3rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] w-full max-w-3xl relative z-10 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header Section */}
        <div className="p-10 md:p-14 border-b border-slate-50 relative overflow-hidden bg-slate-50/50">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
           <div className="flex justify-between items-start relative z-10">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <span className="Vault-badge bg-blue-50 text-blue-600 border-blue-100">Integration Hub v4.0</span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-neural-pulse"></span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-[-0.05em] uppercase">Cloud Relay</h2>
                 <p className="text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] mt-3 uppercase">Extract Nodes from External Mesh</p>
              </div>
              <button 
                onClick={onClose}
                className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-xl border border-slate-100 transition-all hover:scale-110 active:scale-95 group"
              >
                <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
           </div>
        </div>

        {/* Dynamic Content Body */}
        <div className="p-10 md:p-14 overflow-y-auto flex-1 scrollbar-hide">
          {activeTab === 'providers' ? (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {[
                  { id: 'Google Drive', color: '#15803D', icon: 'M15.1504 5.37346L21.7145 16.7423L18.4326 22.4277L8.5833 5.37346H15.1504Z' },
                  { id: 'Dropbox', color: '#0061FF', icon: 'M12 0L3.5 5.3L8.4 9.1L16.8 3.7L12 0Z M12 0L20.5 5.3L15.6 9.1L7.2 3.7L12 0Z M3.5 16L12 21.4L16.8 17.7L8.4 12.3L3.5 16Z M20.5 16L12 21.4L7.2 17.7L15.6 12.3L20.5 16Z' }
                ].map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => handleProviderSelect(p.id)}
                    disabled={isConnecting}
                    className="Vault-card p-10 flex flex-col items-center justify-center gap-6 hover:border-blue-500 hover:bg-blue-50/20 transition-all group overflow-hidden relative"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform relative">
                       {isConnecting && selectedProvider === p.id ? (
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       ) : (
                          <svg className="w-10 h-10" viewBox="0 0 24 24" fill={p.color}><path d={p.icon} /></svg>
                       )}
                    </div>
                    <div className="text-center">
                      <p className="font-black text-slate-900 text-lg uppercase tracking-tight">{p.id}</p>
                      <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{isConnecting && selectedProvider === p.id ? 'VERIFYING...' : 'ESTABLISH LINK'}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-10 border-t border-slate-50">
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 text-center uppercase">Point-to-Point Payload</p>
                 <div className="relative group/input">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-3xl blur opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                    <div className="relative flex gap-4">
                       <input 
                         type="text" 
                         value={urlInput}
                         onChange={(e) => setUrlInput(e.target.value)}
                         placeholder="PASTE VERIFIED UPLINK URL..." 
                         className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-slate-900 font-extrabold text-sm placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-100/50 focus:border-blue-400 transition-all outline-none uppercase tracking-tight"
                       />
                       <button 
                         onClick={handleUrlFetch}
                         disabled={isFetchingUrl || !urlInput.trim()}
                         className="btn-neural btn-neural-primary"
                       >
                          {isFetchingUrl ? '...' : 'FETCH'}
                       </button>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-6 mb-12">
                 <button onClick={() => setActiveTab('providers')} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase">{selectedProvider} Directory</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1 uppercase">Node extraction point</p>
                 </div>
              </div>

              <div className="Vault-card overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-8 py-5 bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   <div className="col-span-8">Payload ID</div>
                   <div className="col-span-4 text-right">Volume</div>
                </div>
                <div className="divide-y divide-slate-50 max-h-[40vh] overflow-y-auto custom-scrollbar">
                  {currentFiles.map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => toggleFileSelection(file.id)}
                      className={`grid grid-cols-12 gap-4 px-8 py-6 items-center cursor-pointer transition-all ${
                        selectedCloudFiles.includes(file.id) ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="col-span-9 flex items-center gap-6">
                         <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${
                           selectedCloudFiles.includes(file.id) ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/30' : 'bg-white border-slate-100'
                         }`}>
                           {selectedCloudFiles.includes(file.id) && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <div className="truncate">
                            <p className="font-extrabold text-slate-900 tracking-tight text-lg uppercase leading-none mb-1.5">{file.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{file.date}</p>
                         </div>
                      </div>
                      <div className="col-span-3 text-right">
                         <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">{file.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {activeTab === 'files' && (
          <div className="p-10 md:p-14 border-t border-slate-50 bg-slate-50/30 backdrop-blur-3xl flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="text-center sm:text-left">
              <p className="text-2xl font-black text-slate-900 leading-none mb-1 tracking-tighter uppercase">{selectedCloudFiles.length} SHARDS</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] uppercase">Ready for re-assembly</p>
            </div>
            <button 
              onClick={handleImportSubmit}
              disabled={selectedCloudFiles.length === 0}
              className="btn-neural btn-neural-primary !px-12 !py-6 w-full sm:w-auto shadow-2xl shadow-blue-500/40 uppercase"
            >
              Initiate Extraction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
