"use client";

import React, { useState, useEffect } from 'react';
import {
  Code2, Database, Smartphone, Layout, Cpu, Server, Coffee, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

// Local registry of skills and categories used for recommendations
const skillRegistry: Record<string, any> = {
  "Python": { title: "Python", category: "Backend", priority: "Recommended", icon: <Code2 size={16} />, color: "from-blue-500 to-blue-700" },
  "C": { title: "C", category: "Backend", priority: "Medium Priority", icon: <Cpu size={16} />, color: "from-purple-500 to-purple-700" },
  "Advanced JavaScript": { title: "Advanced JavaScript", category: "Frontend", priority: "High Priority", icon: <Code2 size={16} />, color: "from-amber-400 to-orange-500" },
  "NodeJS": { title: "NodeJS", category: "Backend", priority: "High Priority", icon: <Server size={16} />, color: "from-emerald-500 to-green-700" },
  "Java": { title: "Java", category: "Backend", priority: "Recommended", icon: <Coffee size={16} />, color: "from-red-500 to-red-700" },
  "SQL": { title: "SQL", category: "Backend", priority: "High Priority", icon: <Database size={16} />, color: "from-orange-400 to-orange-600" },
  "Kotlin": { title: "Kotlin", category: "Mobile", priority: "Recommended", icon: <Smartphone size={16} />, color: "from-indigo-500 to-blue-600" },
  "TypeScript": { title: "TypeScript", category: "Frontend", priority: "High Priority", icon: <Code2 size={16} />, color: "from-sky-400 to-blue-500" },
  "C++": { title: "C++", category: "Backend", priority: "Medium Priority", icon: <Cpu size={16} />, color: "from-blue-600 to-indigo-800" },
  "Swift": { title: "Swift", category: "Mobile", priority: "Recommended", icon: <Smartphone size={16} />, color: "from-orange-500 to-rose-500" },
  "Flutter": { title: "Flutter", category: "Mobile", priority: "Recommended", icon: <Layout size={16} />, color: "from-cyan-400 to-blue-500" },
  "React": { title: "React", category: "Frontend", priority: "Recommended", icon: <Layout size={16} />, color: "from-blue-400 to-indigo-500" },
  "HTML & CSS": { title: "HTML & CSS", category: "Frontend", priority: "High Priority", icon: <Globe size={16} />, color: "from-pink-500 to-rose-600" }
};

const Dashboard = ({ userId = "user_123" }) => {
  const router = useRouter();
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mainProgress, setMainProgress] = useState(0);
  const [allProgress, setAllProgress] = useState<any>({});
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) {
      setNavCollapsed(saved === "true");
    }
    setIsMounted(true);
    fetchProgress();

    const initial = localStorage.getItem('current-open-skill');
    setActiveSkill(initial || null);

    const handleProgressUpdate = () => {
      fetchProgress();
      const current = localStorage.getItem('current-open-skill');
      setActiveSkill(current || null);
    };
    window.addEventListener("storageProgressUpdate", handleProgressUpdate);
    return () => window.removeEventListener("storageProgressUpdate", handleProgressUpdate);
  }, [userId]);

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", String(newState));
      return newState;
    });
  };

  const fetchProgress = () => {
    try {
      const localData = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
      setAllProgress(localData);

      fetch(`/api/progress?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data?.videos_watched) {
            setMainProgress((data.videos_watched / data.total_videos) * 100);
          }
        })
        .catch(() => {
          if (localData["React"]) {
            const p = ((localData["React"]?.watched?.length || 0) / (localData["React"]?.total || 1)) * 100;
            setMainProgress(p || 0);
          } else {
            setMainProgress(68);
          }
        });
    } catch (e) {
      console.error("Progress fetch error:", e);
    }
  };

  const handleSkillClick = (skillName: string) => {
    router.push(`/browse?skill=${encodeURIComponent(skillName)}`);
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      <Navbar onToggleNav={handleToggleNav} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isNavCollapsed} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Progress Overview</h2>
                <div className="space-y-6">
                  {Object.keys(allProgress).length > 0 ? (
                    Object.entries(allProgress).map(([skill, data]: [string, any], index) => (
                      <SkillProgress
                        key={skill}
                        label={skill}
                        percentage={((data?.watched?.length || 0) / (data?.total || 1)) * 100}
                        color={index % 3 === 0 ? "#4F46E5" : index % 3 === 1 ? "#10B981" : "#3B82F6"}
                        onClick={() => handleSkillClick(skill)}
                      />
                    ))
                  ) : (
                    <>
                      <SkillProgress label="Python" percentage={75} color="#4F46E5" onClick={() => handleSkillClick("Python")} />
                      <SkillProgress label="JavaScript" percentage={60} color="#10B981" onClick={() => handleSkillClick("Advanced JavaScript")} />
                      <SkillProgress label="React" percentage={mainProgress} color="#3B82F6" onClick={() => handleSkillClick("React")} />
                    </>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={activeSkill ? `${activeSkill} - Skill Comparison` : "Skill Comparison"} subtitle={activeSkill ? `Current progress for ${activeSkill}` : "Market gap vs. Your current level"}>
                  <div className="h-56 flex items-end justify-around pt-6 px-4">
                    {Object.keys(allProgress).length > 0 ? (
                      Object.entries(allProgress)
                        .sort((a: any, b: any) => {
                          const pa = (a[1]?.watched?.length || 0) / (a[1]?.total || 1);
                          const pb = (b[1]?.watched?.length || 0) / (b[1]?.total || 1);
                          return pb - pa;
                        })
                        .slice(0, 6)
                        .map(([skill, data]: [string, any]) => {
                          const progress = Math.round(((data?.watched?.length || 0) / (data?.total || 1)) * 100);
                          const displayLabel = skill === activeSkill ? `★ ${skill.slice(0,5)}` : skill.slice(0,4);
                          return (
                            <div key={skill} className="cursor-pointer h-full" onClick={() => handleSkillClick(skill)}>
                              <BarGroup label={displayLabel} current={progress} target={85} />
                            </div>
                          );
                        })
                    ) : (
                      <>
                        <BarGroup label="PY" current={40} target={85} />
                        <BarGroup label="JS" current={30} target={90} />
                        <BarGroup label="SQL" current={20} target={80} />
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-50">
                    <Legend color="bg-indigo-500" label="Your Current Progress" />
                    <Legend color="bg-slate-300" label="Industry Benchmark" />
                  </div>
                </Card>

                <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{activeSkill ? `Next Steps for ${activeSkill}` : "Global Recommendations"}</h2>
                      <p className="text-[10px] text-slate-400 font-medium">{activeSkill ? "Tailored to your current course" : "Skills to boost your employability"}</p>
                    </div>
                    <Link href="/browse" className="text-indigo-600 text-[10px] font-bold hover:underline">
                      Browse All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {getRecommendationsForSkill(activeSkill, allProgress).map((item: any) => (
                      <RecommendationItem
                        key={item.title}
                        onClick={() => handleSkillClick(item.title)}
                        icon={item.icon}
                        title={item.title}
                        subtitle={item.subtitle}
                        tag={item.tag}
                        bgColor={item.bgColor}
                        tagColor={item.tagColor}
                      />
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Helper Components ---

const getRecommendationsForSkill = (skill: string | null, progress: Record<string, any>) => {
  const categories = [
    { name: 'Frontend', skills: ['HTML & CSS', 'Advanced JavaScript', 'TypeScript', 'React'] },
    { name: 'Backend', skills: ['NodeJS', 'Python', 'Java', 'C#', 'SQL', 'C++'] },
    { name: 'Mobile', skills: ['Flutter', 'Kotlin', 'Swift'] },
    { name: 'AI / ML', skills: ['Python', 'C++'] }
  ];

  const defaultRecs = [
    { title: 'Advanced JavaScript', subtitle: 'Critical skill gap identified', tag: 'HIGH PRIORITY', bgColor: 'bg-red-50', tagColor: 'text-red-600', icon: <Code2 size={16} className="text-red-500" /> },
    { title: 'SQL', subtitle: 'Strengthen your foundation', tag: 'MEDIUM PRIORITY', bgColor: 'bg-orange-50', tagColor: 'text-orange-600', icon: <Database size={16} className="text-orange-500" /> }
  ];

  if (skill) {
    const activeCategory = categories.find(c => c.skills.includes(skill));
    if (activeCategory) {
      return activeCategory.skills
        .filter(s => s !== skill)
        .map(s => {
          const info = skillRegistry[s] || {};
          return {
            title: s,
            subtitle: `Next step in ${activeCategory.name}`,
            tag: info.priority?.toUpperCase() || 'RECOMMENDED',
            bgColor: 'bg-indigo-50',
            tagColor: 'text-indigo-600',
            icon: info.icon ? React.cloneElement(info.icon, { size: 16, className: 'text-indigo-500' }) : <Code2 size={16} className='text-indigo-500' />
          };
        }).slice(0,4);
    }
  }

  const counts: Record<string, number> = {};
  Object.keys(progress || {}).forEach(sk => {
    const meta = skillRegistry[sk];
    if (meta) counts[meta.category] = (counts[meta.category] || 0) + 1;
  });

  const dominant = Object.entries(counts).sort((a,b) => b[1] - a[1])[0];
  if (dominant) {
    const catName = dominant[0];
    const cat = categories.find(c => c.name === catName);
    if (cat) {
      return cat.skills
        .filter(s => !Object.keys(progress || {}).includes(s))
        .map(s => {
          const info = skillRegistry[s] || {};
          return {
            title: s,
            subtitle: `Related ${cat.name} skill`,
            tag: info.priority?.toUpperCase() || 'RECOMMENDED',
            bgColor: 'bg-indigo-50',
            tagColor: 'text-indigo-600',
            icon: info.icon ? React.cloneElement(info.icon, { size: 16, className: 'text-indigo-500' }) : <Code2 size={16} className='text-indigo-500' />
          };
        }).slice(0,4);
    }
  }
  return defaultRecs;
};

const RecommendationItem = ({ icon, title, subtitle, tag, bgColor, tagColor, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-xl border border-slate-50 flex items-center justify-between group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${bgColor} bg-opacity-60 group-hover:scale-105 transition-transform`}>{icon}</div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-100 ${bgColor} ${tagColor} tracking-tight`}>{tag}</span>
  </div>
);

const SkillProgress = ({ label, percentage, color, onClick }: any) => (
  <div className="space-y-2 cursor-pointer group" onClick={onClick}>
    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight">
      <span className="group-hover:text-indigo-600 transition-colors">{label}</span>
      <span className="text-indigo-600 font-black">{Math.round(percentage)}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const Legend = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
  </div>
);

const Card = ({ title, subtitle, children }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
    <h3 className="font-bold text-sm text-slate-900">{title}</h3>
    <p className="text-[10px] text-slate-400 font-medium mb-4 uppercase tracking-tighter">{subtitle}</p>
    <div className="flex-1">{children}</div>
  </div>
);

const BarGroup = ({ label, current, target }: any) => {
  const safe = (v: any) => {
    const n = Number(v);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  const cur = safe(current);
  const tar = safe(target);

  const toDiscreteClass = (n: number) => {
    if (!n || n <= 0) return 'hp-0';
    const rounded = Math.round(n / 10) * 10;
    return `hp-${Math.max(10, Math.min(100, rounded))}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 h-full group cursor-default">
      <div className="text-[10px] font-bold text-slate-500">{cur}%</div>
      <div className="flex items-end gap-1.5 h-full min-h-[140px]">
        <div
          className={`w-2.5 ${toDiscreteClass(cur)} bg-indigo-500 rounded-t-sm transition-all duration-500 hover:brightness-110`}
          aria-label={`${label} current progress`} />
        <div
          className={`w-2.5 ${toDiscreteClass(tar)} bg-slate-200 rounded-t-sm transition-all duration-500 group-hover:bg-slate-300`}
          aria-hidden="true" />
      </div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
  );
};

export default Dashboard;