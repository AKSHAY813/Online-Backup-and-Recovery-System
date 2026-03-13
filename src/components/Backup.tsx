import { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: string;
  selected: boolean;
  children?: FileItem[];
}

const initialFiles: FileItem[] = [
  { 
    id: '1', 
    name: 'Documents', 
    type: 'folder', 
    size: '2.3 GB', 
    selected: true,
    children: [
      { id: '1-1', name: 'Work', type: 'folder', size: '1.2 GB', selected: true },
      { id: '1-2', name: 'Personal', type: 'folder', size: '800 MB', selected: true },
      { id: '1-3', name: 'Reports.xlsx', type: 'file', size: '15 MB', selected: true },
    ]
  },
  { 
    id: '2', 
    name: 'Photos', 
    type: 'folder', 
    size: '15.8 GB', 
    selected: true,
    children: [
      { id: '2-1', name: '2024', type: 'folder', size: '8.2 GB', selected: true },
      { id: '2-2', name: '2023', type: 'folder', size: '7.6 GB', selected: true },
    ]
  },
  { id: '3', name: 'Videos', type: 'folder', size: '45.2 GB', selected: false },
  { id: '4', name: 'Music', type: 'folder', size: '8.1 GB', selected: false },
  { id: '5', name: 'Projects', type: 'folder', size: '4.1 GB', selected: true },
  { id: '6', name: 'system_backup.img', type: 'file', size: '32 GB', selected: false },
  { id: '7', name: 'database.sql', type: 'file', size: '1.8 GB', selected: true },
];

export function Backup() {
  const [files, setFiles] = useState(initialFiles);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [backupName, setBackupName] = useState('');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [compressionEnabled, setCompressionEnabled] = useState(true);

  const toggleSelection = (id: string) => {
    setFiles(files.map(f => 
      f.id === id ? { ...f, selected: !f.selected } : f
    ));
  };

  const toggleExpand = (id: string) => {
    setExpandedFolders(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectedCount = files.filter(f => f.selected).length;
  const totalSize = files.filter(f => f.selected).reduce((acc, f) => {
    const size = parseFloat(f.size);
    const unit = f.size.includes('GB') ? 1 : 0.001;
    return acc + (size * unit);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Create Backup</h2>
        <p className="text-slate-500">Select files and folders to backup securely</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Selection */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Select Files & Folders</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setFiles(files.map(f => ({ ...f, selected: true })))}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Select All
              </button>
              <span className="text-slate-300">|</span>
              <button 
                onClick={() => setFiles(files.map(f => ({ ...f, selected: false })))}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {files.map((item) => (
                <div key={item.id}>
                  <div 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      item.selected ? 'bg-cyan-50 border border-cyan-200' : 'bg-slate-50 border border-transparent hover:bg-slate-100'
                    }`}
                    onClick={() => toggleSelection(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelection(item.id)}
                      className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    {item.type === 'folder' && item.children && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <svg 
                          className={`w-4 h-4 text-slate-500 transition-transform ${expandedFolders.includes(item.id) ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'folder' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {item.type === 'folder' ? (
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.size}</p>
                    </div>
                    {item.selected && (
                      <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Children */}
                  {item.children && expandedFolders.includes(item.id) && (
                    <div className="ml-10 mt-2 space-y-2">
                      {item.children.map(child => (
                        <div 
                          key={child.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            child.type === 'folder' ? 'bg-yellow-50' : 'bg-blue-50'
                          }`}>
                            {child.type === 'folder' ? (
                              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-slate-700">{child.name}</span>
                          <span className="text-xs text-slate-400 ml-auto">{child.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Backup Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Backup Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Backup Name</label>
                <input
                  type="text"
                  value={backupName}
                  onChange={(e) => setBackupName(e.target.value)}
                  placeholder="e.g., Weekly Backup"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Encryption</p>
                    <p className="text-xs text-slate-500">AES-256 bit</p>
                  </div>
                </div>
                <button
                  onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${encryptionEnabled ? 'bg-cyan-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${encryptionEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Compression</p>
                    <p className="text-xs text-slate-500">Save storage space</p>
                  </div>
                </div>
                <button
                  onClick={() => setCompressionEnabled(!compressionEnabled)}
                  className={`w-12 h-6 rounded-full transition-all ${compressionEnabled ? 'bg-cyan-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${compressionEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Backup Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cyan-100">Selected Items</span>
                <span className="font-medium">{selectedCount} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-100">Total Size</span>
                <span className="font-medium">{totalSize.toFixed(1)} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-100">Encryption</span>
                <span className="font-medium">{encryptionEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-100">Compression</span>
                <span className="font-medium">{compressionEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <button className="w-full mt-6 bg-white text-cyan-600 py-3 rounded-xl font-semibold hover:bg-cyan-50 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Start Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
