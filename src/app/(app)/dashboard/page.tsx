"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Play, Zap, BookOpen,
  ArrowRight, BarChart, ChevronDown, ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { getCourseLogo } from '@/lib/courseLogos';

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
    comparison: Array<{ name: string; user: number; market: number }>;
  };
  widgetState: Record<string, unknown>;
}

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [showAllSkills, setShowAllSkills] = useState(false);

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
  const hasActivity = useMemo(() => data && (
    (data.progress.lecturesCompleted > 0) ||
    (data.progress.skills && Object.keys(data.progress.skills).length > 0)
  ), [data]);

  const activeSkills = useMemo(() => data?.progress.skills ? Object.entries(data.progress.skills) : [], [data]);
  const activeSkillName = data?.userProfile.activeSkill || "Select a Track";

  const visibleSkills = showAllSkills ? activeSkills : activeSkills.slice(0, 3);
  const hiddenSkillsCount = activeSkills.length - 3;

  const comparisonData = Array.isArray(data?.analytics?.comparison) ? data.analytics.comparison : [];
  const visibleComparison = showAllSkills ? comparisonData : comparisonData.slice(0, 3);

  // Debug Log
  useEffect(() => {
    if (data) {
      console.log("Derived State -> HasActivity:", hasActivity, "ActiveSkills:", activeSkills);
    }
  }, [data, hasActivity, activeSkills]);

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
          <Link href="/browse" className="inline-block w-full bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-700 transition">
            Start Learning
          </Link>
        </div>
      </div>
    );
  }

  // Available courses (title + category) used to scope recommendations
  const AVAILABLE_COURSES = [
    { title: 'React', category: 'frontend' },
    { title: 'HTML & CSS', category: 'frontend' },
    { title: 'JavaScript', category: 'frontend' },
    { title: 'TypeScript', category: 'frontend' },
    { title: 'React Native', category: 'mobile' },
    { title: 'NodeJS', category: 'backend' },
    { title: 'Python', category: 'backend' },
    { title: 'Java', category: 'backend' },
    { title: 'SQL', category: 'backend' },
    { title: 'C', category: 'systems' },
    { title: 'C++', category: 'systems' },
    { title: 'Kotlin', category: 'mobile' },
    { title: 'Swift', category: 'mobile' },
    { title: 'Flutter', category: 'mobile' }
  ];

  const keywordCategory = (name: string) => {
    if (!name) return null;
    const k = name.toLowerCase();
    if (['html', 'css', 'react', 'frontend', 'javascript', 'typescript'].some(x => k.includes(x))) return 'frontend';
    if (['node', 'python', 'java', 'sql', 'backend', 'server'].some(x => k.includes(x))) return 'backend';
    if (['kotlin', 'swift', 'flutter', 'mobile', 'react native'].some(x => k.includes(x))) return 'mobile';
    if (['c++', 'c', 'systems'].some(x => k.includes(x))) return 'systems';
    return null;
  };

  // Determine user's dominant watched category
  const determineTopCategory = () => {
    const skills = data?.progress?.skills || {};
    const counts: Record<string, number> = {};

    Object.entries(skills).forEach(([skillName, skillData]) => {
      const weight = Array.isArray(skillData.watched) ? skillData.watched.length : 1;
      // try exact match with AVAILABLE_COURSES
      const matched = AVAILABLE_COURSES.find(c => skillName.toLowerCase().includes(c.title.toLowerCase()));
      const category = matched ? matched.category : (keywordCategory(skillName) || 'other');
      counts[category] = (counts[category] || 0) + weight;
    });

    // pick highest
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  };

  const filteredRecommendations = (() => {
    const recs = data?.recommendations || [];
    const topCategory = determineTopCategory();
    if (!topCategory) return recs;

    // build set of available course titles in the same category
    const allowed = AVAILABLE_COURSES.filter(c => c.category === topCategory).map(c => c.title.toLowerCase());

    const filtered = recs.filter(r => {
      const title = (r.title || '').toLowerCase();
      // allow if recommendation title matches any allowed course title
      return allowed.some(a => title.includes(a) || a.includes(title));
    });

    return filtered.length > 0 ? filtered : recs;
  })();

  // Main Dashboard UI
  return (

    <div className="flex flex-1 overflow-hidden h-full">
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* 1. Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* 2. In Progress Skills (Loop over all active skills) */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Zap size={20} className="text-indigo-500" /> In Progress
              </h2>

              {activeSkills.length === 0 && (
                <div className="p-8 bg-white rounded-3xl border border-slate-100 text-center text-slate-400">
                  No courses in progress.
                </div>
              )}

              {visibleSkills.map(([skillName, skillData]: [string, { watched: string[]; total: number }]) => {
                const progress = skillData.total > 0 ? Math.round((skillData.watched.length / skillData.total) * 100) : 0;
                const logoInfo = getCourseLogo(skillName);
                return (
                  <div key={skillName} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col hover:border-indigo-100 transition-all group">
                    <div className="flex justify-between items-center mb-4 gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: logoInfo.bgColor }}>
                        <Image src={logoInfo.url} alt={skillName} width={32} height={32} className="w-8 h-8 object-contain" unoptimized={true} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900">{skillName}</h3>
                        <p className="text-sm text-slate-500">{skillData.watched.length} / {skillData.total} Lectures</p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-slate-900">{progress}%</span>
                      </div>
                    </div>

                    {/* Progress Bar with color matching logo */}
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%`, backgroundColor: logoInfo.bgHex }}
                      />
                    </div>

                    <div className="flex justify-end mt-auto">
                      <Link
                        href={`/browse?skill=${encodeURIComponent(skillName)}`}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        Continue Learning <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Skill Gap Analysis (Multi-Bar Graph) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col hover:border-indigo-100 transition-all">
              <div className="mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart size={20} className="text-indigo-500" />
                  Skill Gap Analysis
                </h3>
                <p className="text-xs text-slate-400 mt-1">Your Progress vs Market (100%)</p>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                {visibleComparison.map((item, index) => (
                  <div key={index} className="space-y-4 border-b border-slate-50 pb-6 last:border-0">
                    <h4 className="font-bold text-slate-800">{item.name}</h4>

                    {/* User Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        <span>Your Progress</span>
                        <span className="text-indigo-600">{item.user}%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all duration-1000"
                          style={{ width: `${item.user}%` }}
                        />
                      </div>
                    </div>

                    {/* Market Requirement Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                        <span>Market Requirement</span>
                        <span className="text-emerald-500">100%</span>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full transition-all duration-1000"
                          style={{ width: `100%` }}
                        />
                      </div>
                    </div>

                  </div>
                ))}

                {comparisonData.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-10">Start learning to see analysis.</p>
                )}
              </div>
            </div>

          </div>

          {/* Global Toggle Button */}
          {hiddenSkillsCount > 0 && (
            <div className="flex justify-center mt-4 mb-8">
              {!showAllSkills ? (
                <button
                  onClick={() => setShowAllSkills(true)}
                  className="w-full max-w-md py-4 flex items-center justify-center gap-2 text-sm font-bold text-indigo-600 bg-white border border-indigo-100 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 rounded-2xl transition-all"
                >
                  View {hiddenSkillsCount} More Courses <ChevronDown size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowAllSkills(false)}
                  className="w-full max-w-md py-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 rounded-2xl transition-all"
                >
                  Show Less <ChevronUp size={16} />
                </button>
              )}
            </div>
          )}

          {/* 4. Recommendations Row (Strictly Filtered) */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recommended Next Steps</h3>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Based on {activeSkillName}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredRecommendations.map((rec, i) => (
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
