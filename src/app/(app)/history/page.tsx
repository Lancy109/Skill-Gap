"use client";

import React, { useState, useEffect } from 'react';
import { History, Play, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { getCourseLogo } from '@/lib/courseLogos';

export default function HistoryPage() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<{
    progress?: {
      skills?: Record<string, { watched: string[]; total: number }>;
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isDeletingCourse, setIsDeletingCourse] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadHistory() {
      if (!isLoaded) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/history?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error('Error loading history:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadHistory();
  }, [user, isLoaded]);

  const handleClearHistory = async () => {
    if (!user) return;
    if (!confirm('Are you sure you want to completely erase your learning history? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/history?userId=${user.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setData(null);
        // Clear the client-side cache so the Browse page marks courses as unread
        localStorage.removeItem(`skill-gap-progress-${user.id}`);
        localStorage.removeItem(`current-open-skill-${user.id}`);
      } else {
        alert('Failed to clear history');
      }
    } catch (err) {
      console.error('Error clearing history:', err);
      alert('An error occurred while clearing history.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCourse = async (skillName: string) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete your progress for ${skillName}? This action cannot be undone.`)) return;

    setIsDeletingCourse(prev => ({ ...prev, [skillName]: true }));
    try {
      const response = await fetch(`/api/history?userId=${user.id}&skillName=${encodeURIComponent(skillName)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Optimistically remove from state
        setData((prevData: { progress?: { skills?: Record<string, { watched: string[]; total: number }> } } | null) => {
          if (!prevData?.progress?.skills) return prevData;
          const newSkills = { ...prevData.progress.skills };
          delete newSkills[skillName];
          return {
            ...prevData,
            progress: {
              ...prevData.progress,
              skills: newSkills
            }
          };
        });

        // Update local storage
        const localData = localStorage.getItem(`skill-gap-progress-${user.id}`);
        if (localData) {
          try {
            const parsed = JSON.parse(localData);
            if (parsed[skillName]) {
              delete parsed[skillName];
              localStorage.setItem(`skill-gap-progress-${user.id}`, JSON.stringify(parsed));
              window.dispatchEvent(new Event('storageProgressUpdate'));
            }
          } catch (e) {
            console.error("Local storage sync error", e);
          }
        }

        // Check active skill local storage too
        const activeSkill = localStorage.getItem(`current-open-skill-${user.id}`);
        if (activeSkill === skillName) {
          localStorage.removeItem(`current-open-skill-${user.id}`);
        }

      } else {
        alert(`Failed to delete history for ${skillName}`);
      }
    } catch (err) {
      console.error(`Error deleting history for ${skillName}:`, err);
      alert(`An error occurred while deleting history for ${skillName}.`);
    } finally {
      setIsDeletingCourse(prev => ({ ...prev, [skillName]: false }));
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeSkills = data?.progress?.skills ? Object.entries(data.progress.skills) : [];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
            <History size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Watch History</h1>
            <p className="text-slate-500">Pick up your skills where you left off</p>
          </div>
        </div>

        {activeSkills.length > 0 && (
          <button
            onClick={handleClearHistory}
            disabled={isDeleting}
            className="px-4 py-2 flex items-center gap-2 text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {activeSkills.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {activeSkills.map(([skillName, skillData]: [string, { watched: string[]; total: number }]) => {
              const progress = skillData.total > 0 ? Math.round((skillData.watched.length / skillData.total) * 100) : 0;
              const isDeletingThis = isDeletingCourse[skillName];

              return (
                <div key={skillName} className={`p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-6 md:items-center group ${isDeletingThis ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="w-full md:w-32 h-20 rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-all relative" style={{ backgroundColor: getCourseLogo(skillName).bgColor.replace('bg-', '#').substring(0, 7) || '#6366f1' }}>
                    <Image
                      src={getCourseLogo(skillName).url}
                      alt={`${skillName} logo`}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-contain"
                      unoptimized={true}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                      <Play size={28} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-xl text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{skillName} Track</h3>
                    <p className="text-sm font-bold text-slate-400 mb-4">{skillData.watched.length} of {skillData.total} Lectures Watched</p>

                    <div className="max-w-md">
                      <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                        <span>Course Completion</span>
                        <span className="text-indigo-600">{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleDeleteCourse(skillName)}
                      disabled={isDeletingThis}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title={`Remove ${skillName} from history`}
                    >
                      <Trash2 size={18} />
                    </button>
                    <Link href={`/browse?skill=${encodeURIComponent(skillName)}`}>
                      <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm shrink-0 whitespace-nowrap">
                        {progress === 100 ? 'Review Selected Track' : 'Resume Track'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
              <History size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No History Yet</h3>
            <p className="text-slate-400 max-w-sm mx-auto mb-6">Start watching courses in the Browse section to track your progress here.</p>
            <Link href="/browse">
              <button className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                Explore Courses
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}