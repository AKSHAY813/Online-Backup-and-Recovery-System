import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp: Date;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  history: Toast[];
  clearHistory: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const [history, setHistory] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const newToast: Toast = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date()
    };
    setToast(newToast);
    setHistory(prev => [newToast, ...prev]);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, history, clearHistory }}>
      {children}
      {toast && (
        <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[300] animate-slide-up pointer-events-none">
          <div className={`px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-5 border backdrop-blur-3xl transition-all duration-500 ${
            toast.type === 'success' ? 'bg-emerald-600/95 border-emerald-400/50 text-white shadow-emerald-500/20' :
            toast.type === 'error' ? 'bg-rose-600/95 border-rose-400/50 text-white shadow-rose-500/20' :
            'bg-slate-900/95 border-slate-700 text-white shadow-blue-500/20'
          }`}>
             <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                {toast.type === 'success' ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : toast.type === 'error' ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
             </div>
            <span className="font-black text-sm md:text-base tracking-tight uppercase">{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
