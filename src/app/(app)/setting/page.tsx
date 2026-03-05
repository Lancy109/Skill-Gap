"use client";

import React, { useEffect, useState } from 'react';

type Settings = {
  theme: 'light' | 'dark' | 'system';
  notifications: { email: boolean; push: boolean };
  profileVisibility: 'public' | 'private';
  reminders: { enabled: boolean; time: string };
};

const DEFAULT: Settings = {
  theme: 'system',
  notifications: { email: true, push: true },
  profileVisibility: 'public',
  reminders: { enabled: false, time: '18:00' }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('skill-gap-settings');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setSettings(JSON.parse(raw) as Settings);
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('skill-gap-settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  const resetDefaults = () => setSettings(DEFAULT);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Configure your preferences for the SkillGap experience</p>
        </div>
        <div className="text-sm text-slate-400">Changes are saved locally</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold">Theme</h3>
          <p className="text-xs text-slate-400">Choose your preferred color scheme</p>
          <div className="mt-3 flex gap-3">
            {(['light', 'dark', 'system'] as Settings['theme'][]).map(t => (
              <button
                key={t}
                onClick={() => setSettings(s => ({ ...s, theme: t }))}
                className={`px-4 py-2 rounded-lg border text-sm ${settings.theme === t ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold">Privacy</h3>
          <p className="text-xs text-slate-400">Control who can see your profile and activity</p>
          <div className="mt-3 flex gap-3">
            <button onClick={() => setSettings(s => ({ ...s, profileVisibility: 'public' }))} className={`px-4 py-2 rounded-lg border text-sm ${settings.profileVisibility === 'public' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>Public</button>
            <button onClick={() => setSettings(s => ({ ...s, profileVisibility: 'private' }))} className={`px-4 py-2 rounded-lg border text-sm ${settings.profileVisibility === 'private' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'border-slate-200 text-slate-600'}`}>Private</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold">Notifications</h3>
          <p className="text-xs text-slate-400">Manage how we keep you informed</p>
          <div className="mt-3 flex flex-col gap-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Email notifications</span>
              <input type="checkbox" checked={settings.notifications.email} onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, email: e.target.checked } }))} />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Push notifications</span>
              <input type="checkbox" checked={settings.notifications.push} onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, push: e.target.checked } }))} />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <h3 className="font-bold">Learning Reminders</h3>
          <p className="text-xs text-slate-400">Daily reminders to keep your streak going</p>
          <div className="mt-3 flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.reminders.enabled} onChange={e => setSettings(s => ({ ...s, reminders: { ...s.reminders, enabled: e.target.checked } }))} />
              <span className="text-sm">Enable daily reminder</span>
            </label>
            <input type="time" value={settings.reminders.time} onChange={e => setSettings(s => ({ ...s, reminders: { ...s.reminders, time: e.target.value } }))} className="ml-auto border rounded-md px-2 py-1 text-sm" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={() => { alert('Settings saved locally'); }} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow">Save</button>
        <button onClick={resetDefaults} className="px-4 py-2 border rounded-xl">Reset</button>
        <button onClick={() => { localStorage.removeItem('skill-gap-settings'); setSettings(DEFAULT); alert('Settings cleared'); }} className="ml-auto px-4 py-2 text-red-600 border border-red-100 rounded-xl">Clear Stored Settings</button>
      </div>
    </div>
  );
}
