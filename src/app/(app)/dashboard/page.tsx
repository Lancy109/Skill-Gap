"use client";

import React, { useState, useEffect } from 'react';
import {
  Play, Award, Zap, TrendingUp, BookOpen,
  CheckCircle2, Lock, ArrowRight, BarChart
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

// --- Types ---
interface DashboardData {
  userProfile: {
    userId: string;
    name?: string;
    activeSkill?: string;
  };
  progress: {
    overall: number;
    modulesCompleted: number;
    lecturesCompleted: number;
    skills: Record<string, { total: number; watched: string[] }>;
  };
  recommendations: Array<{ title: string; type: string; priority: string }>;
  analytics: {
    timeSpent: number[];
    streak: number;
    comparison: {
      user: number;
      market: number;
      trackAvg: number;
    };
  };
  widgetState: any;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Initial Load
  useEffect(() => {
    if (isLoaded && user) {
      fetchDashboardData(user.id);
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard?userId=${userId}`);
      if (res.ok) {
        const json = await res.json();
        console.log("Dashboard Data:", json);

        // Debugging hasActivity logic
        const hasAct = json && (json.progress.lecturesCompleted > 0 || !!json.userProfile.activeSkill);
        console.log("Has Activity:", hasAct, "Lectures:", json.progress.lecturesCompleted, "ActiveSkill:", json.userProfile.activeSkill);

        setData(json);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Derived State
  // Ensure we rely on truthy check that handles null/undefined/empty string correctly
  const hasActivity = data && (
    (data.progress.lecturesCompleted > 0) ||
    (data.userProfile.activeSkill && data.userProfile.activeSkill.length > 0)
  );

  const activeSkillName = data?.userProfile.activeSkill || "Select a Track";
  const activeSkillData = data?.progress.skills[activeSkillName];
  const activeSkillProgress = activeSkillData && activeSkillData.total > 0
    ? Math.round((activeSkillData.watched.length / activeSkillData.total) * 100)
    : 0;

  // Debug Log
  useEffect(() => {
    if (data) {
      console.log("Derived State -> HasActivity:", hasActivity, "ActiveSkill:", data.userProfile.activeSkill);
    }
  }, [data, hasActivity]);

  // Loading State
  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Blank State (New User)
  if (!hasActivity) {
    return (
        <div className="flex flex-1 items-center justify-center text-center p-6 bg-[#F8FAFC] h-full">
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 max-w-md w-full">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
              <Play size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome, {user?.firstName}!</h1>
            <p className="text-slate-500 mb-8">Ready to bridge the skill gap? Choose a track to start building your personalized learning journey.</p>
            <Link href="/browse" className="inline-block w-full bg-orange-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
              Start Your Journey [DEBUG]
            </Link>
          </div>
        </div>

    );
  }

  // Main Dashboard UI
  return (

      <div className="flex flex-1 overflow-hidden h-full">
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* 1. Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-900">Dashboard <span className="text-xs text-slate-300">v3.0</span></h1>
              <p className="text-slate-500 mt-1">
                Current Focus: <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{activeSkillName}</span>
              </p>
              {/* Removed Metrics as requested */}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* 2. Active Track Progress (Large Card) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">In Progress</div>
                      <h2 className="text-2xl font-black text-slate-900">{activeSkillName} Mastery</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-slate-900">{activeSkillProgress}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${activeSkillProgress}%` }}
                    />
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Link
                      href={`/browse?skill=${encodeURIComponent(activeSkillName)}`}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                    >
                      <Play size={18} fill="currentColor" /> Resume Learning
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. Skill Gap Analysis (Improved Graph) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:border-indigo-100 transition-all">
                <div className="mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <BarChart size={20} className="text-indigo-500" />
                    Skill Gap Analysis
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">You vs Market Requirements</p>
                </div>

                <div className="flex-1 flex flex-col justify-end gap-3 px-2">
                  {/* Market Bar (Horizontal) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Market Goal</span>
                      <span>100%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 bg-slate-300 w-full" />
                    </div>
                  </div>

                  {/* User Bar (Horizontal) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Your Progress</span>
                      <span className="text-indigo-600">{Math.round(data?.analytics.comparison.user || 0)}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full transition-all duration-1000"
                        style={{ width: `${data?.analytics.comparison.user}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      You need <span className="font-bold text-indigo-600">{100 - (data?.analytics.comparison.user || 0)}%</span> more to reach market readiness.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* 4. Recommendations Row (Strictly Filtered) */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Recommended Next Steps</h3>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Based on {activeSkillName}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data?.recommendations.map((rec, i) => (
                  <Link key={i} href={`/browse?skill=${encodeURIComponent(rec.title)}`} className="block">
                    <div className="h-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                          <BookOpen size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full">{rec.priority}</span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mb-1">{rec.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{rec.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div >
  );
}
