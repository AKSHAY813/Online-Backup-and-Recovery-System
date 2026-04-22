import { useState } from 'react';
import type { BackupSchedule } from '@/types';

const initialSchedules: BackupSchedule[] = [
  { id: '1', name: 'Daily Documents Backup', frequency: 'daily', time: '08:00', enabled: true, nextRun: 'Tomorrow at 8:00 AM' },
  { id: '2', name: 'Weekly Full Backup', frequency: 'weekly', time: '02:00', enabled: true, nextRun: 'Sunday at 2:00 AM' },
  { id: '3', name: 'Hourly Database Sync', frequency: 'hourly', time: '00', enabled: false, nextRun: 'Disabled' },
  { id: '4', name: 'Monthly Archive', frequency: 'monthly', time: '03:00', enabled: true, nextRun: 'Feb 1 at 3:00 AM' },
];

export function Schedule() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'daily' as BackupSchedule['frequency'],
    time: '08:00',
  });

  const toggleSchedule = (id: string) => {
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled, nextRun: !s.enabled ? 'Calculating...' : 'Disabled' } : s
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const addSchedule = () => {
    if (newSchedule.name) {
      setSchedules([...schedules, {
        id: Date.now().toString(),
        ...newSchedule,
        enabled: true,
        nextRun: 'Next cycle pending',
      }]);
      setNewSchedule({ name: '', frequency: 'daily', time: '08:00' });
      setShowNewSchedule(false);
    }
  };

  const frequencyIcons: Record<string, React.ReactNode> = {
    hourly: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    daily: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    weekly: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    monthly: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  };

  const frequencyColors: Record<string, string> = {
    hourly: 'bg-orange-600 shadow-orange-500/20',
    daily: 'bg-blue-600 shadow-blue-500/20',
    weekly: 'bg-indigo-600 shadow-indigo-500/20',
    monthly: 'bg-emerald-600 shadow-emerald-500/20',
  };

  return (
    <div className="space-y-12 animate-slide-up font-['Outfit'] pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-1 md:mb-2 text-center md:text-left">Temporal Nodes</h2>
          <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-center md:text-left">Autonomous shard synchronization</p>
        </div>
        <button
          onClick={() => setShowNewSchedule(true)}
          className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-[#0052A1] text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-800 transition-all active:scale-[0.98] flex items-center justify-center gap-4 group"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Deploy Protocol
        </button>
      </div>

      {/* New Schedule Overlay */}
      {showNewSchedule && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-8 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white/95 backdrop-blur-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up md:border md:border-white/50 p-8 md:p-12 relative">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-200 rounded-full md:hidden"></div>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2 text-center md:text-left mt-4 md:mt-0">Protocol Configuration</h3>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 md:mb-10 text-center md:text-left">Define new temporal sync window</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Designation</label>
                  <input
                    type="text"
                    value={newSchedule.name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 md:py-5 rounded-xl md:rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all uppercase text-sm md:text-base"
                    placeholder="e.g. ALPHA_BACKUP_NODE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sync Cycle</label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as BackupSchedule['frequency']})}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 md:py-5 rounded-xl md:rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer text-sm md:text-base"
                  >
                    <option value="hourly">Hourly Cycle</option>
                    <option value="daily">Daily Cycle</option>
                    <option value="weekly">Weekly Cycle</option>
                    <option value="monthly">Monthly Cycle</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Temporal Zero</label>
                  <input
                    type="time"
                    value={newSchedule.time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 px-6 py-4 md:py-5 rounded-xl md:rounded-2xl text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 mb-4 md:mb-0">
                <button
                  onClick={() => setShowNewSchedule(false)}
                  className="flex-1 px-8 py-4 md:py-5 border border-slate-100 text-slate-400 font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl hover:bg-slate-50 transition-all font-bold"
                >
                  Abort
                </button>
                <button
                  onClick={addSchedule}
                  className="flex-1 px-8 py-4 md:py-5 bg-[#0052A1] text-white font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl md:rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-800 transition-all active:scale-[0.98]"
                >
                  Confirm Deploy
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`Vault-card group overflow-hidden transition-all duration-500 ${
              schedule.enabled 
                ? 'bg-white opacity-100 translate-y-0' 
                : 'bg-slate-50 opacity-60 grayscale scale-[0.98]'
            }`}
          >
            <div className={`h-1.5 md:h-2 w-full ${frequencyColors[schedule.frequency]}`}></div>
            <div className="p-6 md:p-8">
               <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${frequencyColors[schedule.frequency]} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    {frequencyIcons[schedule.frequency]}
                  </div>
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${schedule.enabled ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${schedule.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
               </div>

               <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{schedule.name}</h3>
               <div className="flex items-center gap-3 mb-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{schedule.frequency}</span>
                 <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{schedule.time} SHARD</span>
               </div>

               <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{schedule.nextRun}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                   >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                     </svg>
                   </button>
                 </div>
               </div>
            </div>
          </div>
        ))}

        {/* Info Box */}
        <div className="Vault-card bg-slate-900 p-8 text-white relative overflow-hidden group border-none lg:col-span-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-16 translate-x-16"></div>
          <h4 className="text-lg font-black tracking-tighter uppercase mb-4 relative z-10">Neural Intelligence</h4>
          <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6 relative z-10">
            Vault OS optimizes sync windows based on global shard availability and local network throughput.
          </p>
          <div className="flex items-center gap-3 relative z-10 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Active Learning
          </div>
        </div>
      </div>
    </div>
  );
}
