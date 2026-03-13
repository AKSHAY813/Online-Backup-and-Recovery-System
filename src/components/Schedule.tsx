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
        nextRun: 'Calculating...',
      }]);
      setNewSchedule({ name: '', frequency: 'daily', time: '08:00' });
      setShowNewSchedule(false);
    }
  };

  const frequencyIcons: Record<string, React.ReactNode> = {
    hourly: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    daily: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    weekly: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    monthly: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  };

  const frequencyColors: Record<string, string> = {
    hourly: 'bg-orange-100 text-orange-600',
    daily: 'bg-blue-100 text-blue-600',
    weekly: 'bg-purple-100 text-purple-600',
    monthly: 'bg-green-100 text-green-600',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Backup Schedules</h2>
          <p className="text-slate-500">Automate your backup routines</p>
        </div>
        <button
          onClick={() => setShowNewSchedule(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Schedule
        </button>
      </div>

      {/* New Schedule Form */}
      {showNewSchedule && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Schedule Name</label>
              <input
                type="text"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                placeholder="e.g., Daily Backup"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Frequency</label>
              <select
                value={newSchedule.frequency}
                onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as BackupSchedule['frequency'] })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Time</label>
              <input
                type="time"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={addSchedule}
              className="px-6 py-2 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition-all"
            >
              Create Schedule
            </button>
            <button
              onClick={() => setShowNewSchedule(false)}
              className="px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`bg-white rounded-2xl shadow-sm border transition-all ${
              schedule.enabled ? 'border-slate-100' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${frequencyColors[schedule.frequency]}`}>
                    {frequencyIcons[schedule.frequency]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{schedule.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">{schedule.frequency} at {schedule.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`w-12 h-6 rounded-full transition-all ${schedule.enabled ? 'bg-cyan-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${schedule.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Next: {schedule.nextRun}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Tips */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Backup Best Practices
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-1">Regular Backups</p>
            <p className="text-sm text-slate-300">Schedule backups at least daily for critical data</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-1">Off-Peak Hours</p>
            <p className="text-sm text-slate-300">Run backups during low activity periods</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="font-medium mb-1">Test Recovery</p>
            <p className="text-sm text-slate-300">Regularly test your recovery procedures</p>
          </div>
        </div>
      </div>
    </div>
  );
}
