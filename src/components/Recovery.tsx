import { useState, useEffect } from 'react';
import type { RecoveryPoint } from '@/types';
import { mockApi } from '@/services/mockApi';

const recoveryFiles = [
  { id: '1', name: 'Documents', type: 'folder', path: '/Documents', size: '2.3 GB' },
  { id: '2', name: 'Photos', type: 'folder', path: '/Photos', size: '15.8 GB' },
  { id: '3', name: 'Projects', type: 'folder', path: '/Projects', size: '4.1 GB' },
  { id: '4', name: 'database.sql', type: 'file', path: '/database.sql', size: '1.8 GB' },
  { id: '5', name: 'config.json', type: 'file', path: '/config.json', size: '12 KB' },
];

type RecoveryMode = 'file' | 'system' | 'point-in-time';

export function Recovery() {
  const [recoveryPoints, setRecoveryPoints] = useState<RecoveryPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [recoveryMode, setRecoveryMode] = useState<RecoveryMode>('file');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecoveryPoints = async () => {
      try {
        const points = await mockApi.getRecoveryPoints();
        setRecoveryPoints(points);
      } catch (error) {
        console.error('Failed to load recovery points:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecoveryPoints();
  }, []);

  const handleRestore = () => {
    setIsRestoring(true);
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRestoring(false);
            setRestoreProgress(0);
          }, 1500);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Data Recovery</h2>
        <p className="text-slate-500">Restore your files from backup points</p>
      </div>

      {/* Recovery Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setRecoveryMode('file')}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            recoveryMode === 'file' 
              ? 'border-cyan-500 bg-cyan-50' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
            recoveryMode === 'file' ? 'bg-cyan-500' : 'bg-slate-100'
          }`}>
            <svg className={`w-6 h-6 ${recoveryMode === 'file' ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`font-semibold mb-1 ${recoveryMode === 'file' ? 'text-cyan-700' : 'text-slate-800'}`}>File Restore</h3>
          <p className="text-sm text-slate-500">Recover specific files or folders</p>
        </button>

        <button
          onClick={() => setRecoveryMode('system')}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            recoveryMode === 'system' 
              ? 'border-cyan-500 bg-cyan-50' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
            recoveryMode === 'system' ? 'bg-cyan-500' : 'bg-slate-100'
          }`}>
            <svg className={`w-6 h-6 ${recoveryMode === 'system' ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h3 className={`font-semibold mb-1 ${recoveryMode === 'system' ? 'text-cyan-700' : 'text-slate-800'}`}>System Restore</h3>
          <p className="text-sm text-slate-500">Full system image recovery</p>
        </button>

        <button
          onClick={() => setRecoveryMode('point-in-time')}
          className={`p-6 rounded-2xl border-2 transition-all text-left ${
            recoveryMode === 'point-in-time' 
              ? 'border-cyan-500 bg-cyan-50' 
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
            recoveryMode === 'point-in-time' ? 'bg-cyan-500' : 'bg-slate-100'
          }`}>
            <svg className={`w-6 h-6 ${recoveryMode === 'point-in-time' ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={`font-semibold mb-1 ${recoveryMode === 'point-in-time' ? 'text-cyan-700' : 'text-slate-800'}`}>Point-in-Time</h3>
          <p className="text-sm text-slate-500">Restore from specific version</p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Points */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Recovery Points</h3>
            <p className="text-sm text-slate-500 mt-1">Select a backup version</p>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            {recoveryPoints.length > 0 ? (
              <div className="space-y-2">
                {recoveryPoints.map((point) => (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedPoint === point.id 
                        ? 'bg-cyan-50 border-2 border-cyan-500' 
                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        point.type === 'full' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {point.type}
                      </span>
                      <span className="text-xs text-slate-400">{point.size}</span>
                    </div>
                    <p className="font-medium text-slate-800">{point.date}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-400 text-sm italic">No recovery points available yet</p>
              </div>
            )}
          </div>
        </div>

        {/* File Browser / Recovery Options */}
        <div className="lg:col-span-2 space-y-6">
          {recoveryMode === 'file' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800">Select Files to Restore</h3>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {recoveryFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => toggleFileSelection(file.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        selectedFiles.includes(file.id) 
                          ? 'bg-cyan-50 border border-cyan-200' 
                          : 'bg-slate-50 border border-transparent hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        file.type === 'folder' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {file.type === 'folder' ? (
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
                        <p className="font-medium text-slate-800">{file.name}</p>
                        <p className="text-sm text-slate-500">{file.path}</p>
                      </div>
                      <span className="text-sm text-slate-400">{file.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {recoveryMode === 'system' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Full System Restore</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  This will restore your entire system image including OS, applications, and all data to the selected recovery point.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm text-amber-800 text-left">
                      Warning: This operation will overwrite all current data on the target device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {recoveryMode === 'point-in-time' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Version History</h3>
              <p className="text-slate-500 mb-6">
                Browse through different versions of your files and restore any previous state.
              </p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-4">
                  {recoveryPoints.length > 0 ? recoveryPoints.slice(0, 4).map((point, index) => (
                    <div key={point.id} className="relative pl-10">
                      <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${
                        index === 0 ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'
                      }`}>
                        {index === 0 && (
                          <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-slate-800">{point.date}</span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            point.type === 'full' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {point.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">Backup size: {point.size}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 italic ml-10">No history available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Restore Progress */}
          {isRestoring && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-slate-700">Restoring Data...</span>
                <span className="text-sm text-slate-500">{restoreProgress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${restoreProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">Decrypting and downloading files...</p>
            </div>
          )}

          {/* Restore Button */}
          <button
            onClick={handleRestore}
            disabled={isRestoring || (!selectedPoint && recoveryMode !== 'file') || (recoveryMode === 'file' && selectedFiles.length === 0)}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRestoring ? 'Restoring...' : 'Start Recovery'}
          </button>
        </div>
      </div>
    </div>
  );
}
