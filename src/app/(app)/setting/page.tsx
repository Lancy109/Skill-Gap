"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Moon, Sun, Monitor, Bell, Clock, Zap, Volume2, BookOpen, Users } from 'lucide-react';

type Settings = {
  theme: 'light' | 'dark' | 'system';
  notifications: { email: boolean; push: boolean; sound: boolean };
  reminders: { enabled: boolean; frequency: 'daily' | 'weekly'; time: string; days?: string[] };
  learningGoal: number;
  soundEnabled: boolean;
  breakReminders: boolean;
  breakInterval: number;
  communityUpdates: boolean;
};

const DEFAULT: Settings = {
  theme: 'system',
  notifications: { email: true, push: true, sound: true },
  reminders: { enabled: true, frequency: 'daily', time: '09:00', days: [] },
  learningGoal: 5,
  soundEnabled: true,
  breakReminders: true,
  breakInterval: 45,
  communityUpdates: true,
};

// Apply theme to <html> element
function applyTheme(theme: 'light' | 'dark' | 'system') {
  const html = document.documentElement;
  let effective = theme;
  if (theme === 'system') {
    effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (effective === 'dark') {
    html.classList.add('dark');
    html.style.colorScheme = 'dark';
  } else {
    html.classList.remove('dark');
    html.style.colorScheme = 'light';
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount + apply theme
  useEffect(() => {
    try {
      const raw = localStorage.getItem('skill-gap-settings');
      if (raw) {
        const loaded = JSON.parse(raw) as Settings;
        setSettings(loaded);
        applyTheme(loaded.theme);
      } else {
        applyTheme(DEFAULT.theme);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  }, []);

  // Persist + re-apply whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem('skill-gap-settings', JSON.stringify(settings));
      applyTheme(settings.theme);
    } catch (e) {
      console.error('Failed to persist settings', e);
    }
  }, [settings]);

  // Listen for OS dark/light preference changes when 'system' is selected
  useEffect(() => {
    if (settings.theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [settings.theme]);

  const resetDefaults = () => {
    setSettings(DEFAULT);
    applyTheme(DEFAULT.theme);
  };

  const changeTheme = (theme: 'light' | 'dark' | 'system') => {
    setSettings(s => ({ ...s, theme }));
    applyTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Customize your learning experience</p>
        </div>
        {saved && <div className="text-sm text-emerald-600 font-bold animate-pulse">✓ Saved</div>}
      </div>

      {/* Theme Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sun size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Choose your preferred display theme</p>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => changeTheme('light')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-all ${settings.theme === 'light'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            <Sun size={18} /> Light
          </button>
          <button
            onClick={() => changeTheme('dark')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-all ${settings.theme === 'dark'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            <Moon size={18} /> Dark
          </button>
          <button
            onClick={() => changeTheme('system')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-all ${settings.theme === 'system'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
          >
            <Monitor size={18} /> System
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Stay updated with learning progress</p>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="font-bold text-slate-800">Email Notifications</p>
              <p className="text-xs text-slate-500">Get progress updates via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, email: e.target.checked } }))}
              className="w-5 h-5 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="font-bold text-slate-800">Push Notifications</p>
              <p className="text-xs text-slate-500">Browser notifications for milestones</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={e => setSettings(s => ({ ...s, notifications: { ...s.notifications, push: e.target.checked } }))}
              className="w-5 h-5 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Learning Reminders Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Learning Reminders</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Smart reminders to keep you on track</p>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={settings.reminders.enabled}
              onChange={e => setSettings(s => ({ ...s, reminders: { ...s.reminders, enabled: e.target.checked } }))}
              className="w-5 h-5 cursor-pointer"
            />
            <div>
              <p className="font-bold text-slate-800">Enable Reminders</p>
              <p className="text-xs text-slate-500">Get nudged to continue learning</p>
            </div>
          </label>

          {settings.reminders.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                {/* Reminder Time — entire row clickable */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reminder Time</label>
                  <div
                    className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition group"
                    onClick={() => timeInputRef.current?.showPicker?.() || timeInputRef.current?.focus()}
                  >
                    <Clock size={16} className="text-slate-400 group-hover:text-indigo-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 flex-1">
                      {settings.reminders.time || '09:00'}
                    </span>
                    <input
                      ref={timeInputRef}
                      type="time"
                      value={settings.reminders.time}
                      onChange={e => setSettings(s => ({ ...s, reminders: { ...s.reminders, time: e.target.value } }))}
                      className="opacity-0 w-0 h-0 absolute"
                      tabIndex={-1}
                    />
                    <span className="text-xs text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition">Change</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                  <select
                    value={settings.reminders.frequency}
                    onChange={e => setSettings(s => ({ ...s, reminders: { ...s.reminders, frequency: e.target.value as 'daily' | 'weekly' } }))}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              {settings.reminders.frequency === 'weekly' && (
                <div className="pl-8">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Select Days</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          const days = settings.reminders.days || [];
                          if (days.includes(day)) {
                            setSettings(s => ({ ...s, reminders: { ...s.reminders, days: days.filter(d => d !== day) } }));
                          } else {
                            setSettings(s => ({ ...s, reminders: { ...s.reminders, days: [...days, day] } }));
                          }
                        }}
                        className={`py-2 rounded-lg font-bold text-sm transition-all ${(settings.reminders.days || []).includes(day)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Break Reminders Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Study Breaks</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Take regular breaks during learning sessions</p>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
            <div>
              <p className="font-bold text-slate-800">Break Reminders</p>
              <p className="text-xs text-slate-500">Get reminded to take breaks during study</p>
            </div>
            <input
              type="checkbox"
              checked={settings.breakReminders}
              onChange={e => setSettings(s => ({ ...s, breakReminders: e.target.checked }))}
              className="w-5 h-5 cursor-pointer"
            />
          </label>

          {settings.breakReminders && (
            <div className="pl-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Break Interval: {settings.breakInterval} minutes</label>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={settings.breakInterval}
                onChange={e => setSettings(s => ({ ...s, breakInterval: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-500 mt-2">Take a {settings.breakInterval} minute break after each study session</p>
            </div>
          )}
        </div>
      </div>

      {/* Learning Goal Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Learning Goal</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Set your target hours per week</p>
        <div className="space-y-4">
          <input
            type="range"
            min="1"
            max="50"
            value={settings.learningGoal}
            onChange={e => setSettings(s => ({ ...s, learningGoal: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex items-center justify-between">
            <p className="text-slate-700 font-bold">Goal: <span className="text-indigo-600 text-lg">{settings.learningGoal} hours/week</span></p>
            <p className="text-xs text-slate-500">{settings.learningGoal <= 5 ? 'Getting Started' : settings.learningGoal <= 15 ? 'Steady Learner' : 'Committed'}</p>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Users size={20} className="text-slate-600" />
          <h3 className="font-bold text-lg">Community</h3>
        </div>
        <p className="text-xs text-slate-500 mb-5">Connect and share with other learners</p>
        <label className="flex items-center justify-between p-4 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition">
          <div>
            <p className="font-bold text-slate-800">Community Updates</p>
            <p className="text-xs text-slate-500">Receive community and leaderboard updates</p>
          </div>
          <input
            type="checkbox"
            checked={settings.communityUpdates}
            onChange={e => setSettings(s => ({ ...s, communityUpdates: e.target.checked }))}
            className="w-5 h-5 cursor-pointer"
          />
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pb-6">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
        >
          Save Changes
        </button>
        <button
          onClick={resetDefaults}
          className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Hidden BookOpen import usage to avoid unused import warning */}
      <span className="hidden"><BookOpen size={0} /></span>
    </div>
  );
}
