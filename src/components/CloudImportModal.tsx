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
    { id: '1', name: 'Project_Alpha_Specs.pdf', size: '2.4 MB', type: 'pdf', date: 'Oct 24, 2025' },
    { id: '2', name: 'UI_Assets_Final.zip', size: '84.1 MB', type: 'zip', date: 'Oct 23, 2025' },
    { id: '3', name: 'Quarterly_Report_Q3.xlsx', size: '1.1 MB', type: 'excel', date: 'Oct 20, 2025' },
    { id: '4', name: 'Client_Meeting_Recording.mp4', size: '245.8 MB', type: 'video', date: 'Oct 18, 2025' },
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
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setActiveTab('files');
    }, 1500);
  };

  const handleUrlFetch = () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    
    // Simulate extracting filename from link
    const urlParts = urlInput.split('/');
    const possibleName = urlParts[urlParts.length - 1];
    let fileName = possibleName && possibleName.includes('.') ? possibleName.split('?')[0] : 'Fetched_Web_File.pdf';
    
    if (urlInput.includes('drive.google.com')) {
       fileName = 'Google_Drive_Document.pdf';
    }

    setTimeout(() => {
      setIsFetchingUrl(false);
      setSelectedProvider('Direct Link');
      
      const newFile = {
        id: 'url_' + Date.now(),
        name: fileName,
        size: (Math.random() * 15 + 1).toFixed(1) + ' MB',
        type: 'web',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: urlInput
      };
      
      setCurrentFiles([newFile]);
      setSelectedCloudFiles([newFile.id]);
      setActiveTab('files');
    }, 1500);
  };

  const toggleFileSelection = (id: string) => {
    if (selectedCloudFiles.includes(id)) {
      setSelectedCloudFiles(selectedCloudFiles.filter(fId => fId !== id));
    } else {
      setSelectedCloudFiles([...selectedCloudFiles, id]);
    }
  };

  const handleImportSubmit = () => {
    // Create mock File objects to pass to the Backup component
    const filesToImport = selectedCloudFiles.map(id => {
      const fileData = currentFiles.find(f => f.id === id);
      const sizeInBytes = parseFloat(fileData?.size || '1') * 1024 * 1024;
      
      // We mock the File object since we can't actually download from the mock
      const mockFile = new File(["mock content for " + fileData?.name], fileData?.name || "Imported_File", { type: "application/octet-stream" });
      
      // Override the size property using Object.defineProperty to simulate realistic sizes
      Object.defineProperty(mockFile, 'size', { value: sizeInBytes, writable: false });
      
      // Set the source url if it was a web fetch or generate a mock link for drive/dropbox
      const sourceUrl = fileData?.url || (selectedProvider ? `https://${selectedProvider.toLowerCase().replace(/\s/g, '')}.com/view/${id}` : '');
      Object.defineProperty(mockFile, 'sourceUrl', { value: sourceUrl, writable: false });
      
      return mockFile;
    });

    onImport(filesToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cloud Integration</h2>
            <p className="text-slate-500 font-medium mt-1">Import directly from external nodes</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {activeTab === 'providers' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-8">Select Data Source</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Google Drive */}
                <button 
                  onClick={() => handleProviderSelect('Google Drive')}
                  disabled={isConnecting}
                  className="sentinel-card p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform relative">
                     {isConnecting && selectedProvider === 'Google Drive' ? (
                        <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : (
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M15.1504 5.37346L21.7145 16.7423L18.4326 22.4277L8.5833 5.37346H15.1504ZM14.9084 17.1895L18.27 11.3659H5.14329L1.78013 17.1895H14.9084ZM4.94522 16.8443L11.5123 5.38538H14.7942L8.22709 16.8443L4.94522 16.8443Z" fill="#0052A1"/>
                           <path d="M15.1505 5.37346L21.7146 16.7423H15.1505L8.58643 5.37346H15.1505Z" fill="#15803D"/>
                           <path d="M1.78027 17.1896L8.3444 5.82086L11.6263 11.5063L5.06216 22.875L1.78027 17.1896Z" fill="#EAB308"/>
                           <path d="M14.9084 17.1895L11.6265 22.875H18.1906L21.4725 17.1895H14.9084Z" fill="#DC2626"/>
                        </svg>
                     )}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 tracking-tight">Google Drive</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isConnecting && selectedProvider === 'Google Drive' ? 'Connecting...' : 'Connect'}</p>
                  </div>
                </button>

                {/* Dropbox */}
                <button 
                  onClick={() => handleProviderSelect('Dropbox')}
                  disabled={isConnecting}
                  className="sentinel-card p-6 flex flex-col items-center justify-center gap-4 hover:border-blue-500 hover:bg-blue-50/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-[1.2rem] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                     {isConnecting && selectedProvider === 'Dropbox' ? (
                        <svg className="w-6 h-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : (
                        <svg className="w-8 h-8 text-[#0061FF]" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12.0006 0L3.58594 5.37059L8.43261 9.0988L16.8473 3.72583L12.0006 0ZM12.0006 0L20.4153 5.37059L15.5686 9.0988L7.15392 3.72583L12.0006 0ZM3.58594 16.0357L12.0006 21.4063L16.8473 17.6781L8.43261 12.3075L3.58594 16.0357ZM20.4153 16.0357L12.0006 21.4063L7.15392 17.6781L15.5686 12.3075L20.4153 16.0357Z" />
                        </svg>
                     )}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 tracking-tight">Dropbox</p>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{isConnecting && selectedProvider === 'Dropbox' ? 'Connecting...' : 'Connect'}</p>
                  </div>
                </button>
                
                 {/* Web URL */}
                 <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Direct Link Upload</p>
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste your link here (e.g. Google Drive link)..." 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                      <button 
                        onClick={handleUrlFetch}
                        disabled={isFetchingUrl || !urlInput.trim()}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                      >
                         {isFetchingUrl ? (
                           <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                         ) : 'Fetch'}
                      </button>
                   </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                 <button 
                   onClick={() => setActiveTab('providers')}
                   className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                 >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                 </button>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedProvider} Root</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select nodes for extraction</p>
                 </div>
              </div>

              <div className="border border-slate-200 rounded-[1.5rem] overflow-hidden bg-white">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                   <div className="col-span-7">Name</div>
                   <div className="col-span-2">Date</div>
                   <div className="col-span-3 text-right">Size</div>
                </div>
                <div className="divide-y divide-slate-100 max-h-[40vh] overflow-y-auto">
                  {currentFiles.map((file) => (
                    <div 
                      key={file.id} 
                      onClick={() => toggleFileSelection(file.id)}
                      className={`grid grid-cols-12 gap-4 px-6 py-4 items-center cursor-pointer transition-colors ${
                        selectedCloudFiles.includes(file.id) ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="col-span-7 flex items-center gap-4">
                         <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                           selectedCloudFiles.includes(file.id) 
                            ? 'bg-blue-600 border-blue-600 text-white' 
                            : 'bg-white border-slate-300'
                         }`}>
                           {selectedCloudFiles.includes(file.id) && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                           )}
                         </div>
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                           </svg>
                         </div>
                         <span className={`font-black tracking-tight truncate ${selectedCloudFiles.includes(file.id) ? 'text-blue-900' : 'text-slate-800'}`}>
                           {file.name}
                         </span>
                      </div>
                      <div className="col-span-2 text-sm text-slate-500 font-medium">{file.date}</div>
                      <div className="col-span-3 text-right text-sm font-black text-slate-600 tabular-nums">{file.size}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'files' && (
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-500">
              <span className="text-slate-900 font-black">{selectedCloudFiles.length}</span> items selected
            </p>
            <button 
              onClick={handleImportSubmit}
              disabled={selectedCloudFiles.length === 0}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-lg tracking-tight hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
            >
              Initiate Import
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
