import { useState, useEffect } from 'react';
import { mockApi } from '@/services/mockApi';

interface SettingsProps {
  user: {
    name: string;
    email: string;
    plan: string;
  };
  settings: {
    encryption: boolean;
    compression: boolean;
    mfa: boolean;
    notifications: boolean;
    autoUpdate: boolean;
    bandwidth: string;
    retention: string;
    versions: string;
  };
  onSave: (settings: SettingsProps['settings']) => Promise<void>;
  onLogout: () => Promise<void>;
}

export function Settings({ user, settings: initialSettings, onSave, onLogout }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  // Sync local state if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setLocalSettings(initialSettings);
    }
  }, [initialSettings]);

  const updateSetting = (key: string, value: boolean | string) => {
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localSettings);
      setMessage('Settings saved successfully!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    const newPassword = window.prompt('Enter new password:');
    if (!newPassword) return;
    
    setIsSaving(true);
    try {
      await mockApi.changePassword(newPassword);
      alert('Password changed successfully!');
    } catch (error) {
      alert('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (!localSettings) return null;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
          <p className="text-slate-500">Configure your backup preferences and security options</p>
        </div>
        {showSuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold">{message}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Security</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">End-to-End Encryption</p>
                <p className="text-sm text-slate-500">AES-256 bit encryption for all data</p>
              </div>
              <button
                onClick={() => updateSetting('encryption', !localSettings.encryption)}
                className={`w-12 h-6 rounded-full transition-all ${localSettings.encryption ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${localSettings.encryption ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">Multi-Factor Authentication</p>
                <p className="text-sm text-slate-500">Extra security layer for account access</p>
              </div>
              <button
                onClick={() => updateSetting('mfa', !localSettings.mfa)}
                className={`w-12 h-6 rounded-full transition-all ${localSettings.mfa ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${localSettings.mfa ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <button className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-cyan-500 hover:text-cyan-600 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Encryption Key
            </button>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Storage</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">Compression</p>
                <p className="text-sm text-slate-500">Reduce backup size to save storage</p>
              </div>
              <button
                onClick={() => updateSetting('compression', !localSettings.compression)}
                className={`w-12 h-6 rounded-full transition-all ${localSettings.compression ? 'bg-cyan-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${localSettings.compression ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Retention Period</label>
              <select
                value={localSettings.retention}
                onChange={(e) => updateSetting('retention', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Version History</label>
              <select
                value={localSettings.versions}
                onChange={(e) => updateSetting('versions', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="5">Keep last 5 versions</option>
                <option value="10">Keep last 10 versions</option>
                <option value="25">Keep last 25 versions</option>
                <option value="50">Keep last 50 versions</option>
                <option value="unlimited">Keep all versions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Network</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Bandwidth Limit</label>
              <select
                value={localSettings.bandwidth}
                onChange={(e) => updateSetting('bandwidth', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option value="unlimited">Unlimited</option>
                <option value="10">10 Mbps</option>
                <option value="25">25 Mbps</option>
                <option value="50">50 Mbps</option>
                <option value="100">100 Mbps</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Current Upload Speed</span>
                <span className="text-sm text-cyan-600 font-medium">24.5 Mbps</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">Email Notifications</p>
                <p className="text-sm text-slate-500">Get alerts for backup status</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', !localSettings.notifications)}
                className={`w-12 h-6 rounded-full transition-all ${localSettings.notifications ? 'bg-cyan-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${localSettings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">Auto-Update</p>
                <p className="text-sm text-slate-500">Keep backup agent updated</p>
              </div>
              <button
                onClick={() => updateSetting('autoUpdate', !localSettings.autoUpdate)}
                className={`w-12 h-6 rounded-full transition-all ${localSettings.autoUpdate ? 'bg-cyan-500' : 'bg-slate-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${localSettings.autoUpdate ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Account</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold transition-all group-hover:scale-105">
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-slate-800">{user.name}</h4>
              <p className="text-slate-500">{user.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-cyan-100 text-cyan-700 text-sm font-medium rounded-full">
                {user.plan} - 500 GB
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleChangePassword}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all font-medium"
              >
                Change Password
              </button>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Save Button */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save All Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
