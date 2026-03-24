import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    plan: string;
    avatar?: string;
  };
  onSave: (updatedUser: { name: string; email: string; plan: string; avatar?: string }) => void;
}

export function ProfileModal({ isOpen, onClose, user, onSave }: ProfileModalProps) {

  const [formData, setFormData] = useState(user || { name: '', email: '', plan: 'Free Plan' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up border border-white/50">
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Node Settings</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure your active sentinel profile</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 bg-white text-slate-400 hover:text-rose-500 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center transition-all hover:rotate-90 active:scale-90"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/20 overflow-hidden group-hover:scale-105 transition-transform duration-500 ring-8 ring-white">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  formData?.name ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase() : '??'
                )}
              </div>

              <button type="button" className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 rounded-2xl shadow-xl border-4 border-white text-white flex items-center justify-center hover:bg-blue-700 transition-all active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Label</label>
              <input
                type="text"
                required
                value={formData?.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Communication Node</label>
              <input
                type="email"
                required
                value={formData?.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol</label>
              <div className="relative">
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                >
                  <option value="Free Plan">Basic Storage (Free)</option>
                  <option value="Pro Plan">Professional Vault (Pro)</option>
                  <option value="Business Plan">Enterprise Cluster</option>
                  <option value="Enterprise Plan">Unlimited Sovereign</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              className="flex-1 px-8 py-5 bg-[#0052A1] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-[0.98]"
            >
              Verify & Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
