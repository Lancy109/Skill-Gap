"use client";
import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, LayoutDashboard, BookOpen, Pencil, 
  History, Settings, ChevronRight, Target, Zap, LogOut, 
  BrainCircuit, Code2, Database, Smartphone, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

const Dashboard = ({ userId = "user_123" }) => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mainProgress, setMainProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) {
      setNavCollapsed(saved === "true");
    }
    setIsMounted(true);
    fetchProgress();
  }, [userId]);

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", newState);
      return newState;
    });
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch(`/api/progress?userId=${userId}`);
      const data = await res.json();
      if (data) {
        setMainProgress((data.videos_watched / data.total_videos) * 100);
      }
    } catch (e) {
      setMainProgress(68); 
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleToggleNav}
            className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">S</div>
            <span className="font-bold text-slate-900 tracking-tight hidden sm:block">SkillGap</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl px-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search skills or courses..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="Profile" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <motion.aside 
          initial={false}
          animate={{ width: isNavCollapsed ? 70 : 240 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="border-r border-slate-100 bg-white flex flex-col pt-6 overflow-hidden shrink-0"
        >
          <div className="px-3 space-y-1">
            
            <NavItem 
              icon={<LayoutDashboard size={20}/>} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              collapsed={isNavCollapsed} 
              onClick={() => setActiveTab('dashboard')}
            />

            <Link href="/browse" passHref className="block">
              <NavItem 
                icon={<BookOpen size={20}/>} 
                label="Browse" 
                active={activeTab === 'browse'} 
                collapsed={isNavCollapsed} 
                onClick={() => setActiveTab('browse')}
            />
            </Link>
                        
            <Link href="/creator" passHref className="block">
              <NavItem 
                icon={<Pencil size={20}/>} 
                label="Creator" 
                active={activeTab === 'creator'}
                collapsed={isNavCollapsed} 
                onClick={() => setActiveTab('creator')}
            />
            </Link>
            
            <Link href="/history" passHref className="block">
              <NavItem 
                icon={<History size={20}/>} 
                label="History" 
                active={activeTab === 'history'}
                collapsed={isNavCollapsed} 
                onClick={() => setActiveTab('history')}
            />
            </Link>
          </div>
          
          <div className="mt-auto px-3 pb-6 space-y-1 border-t border-slate-50 pt-4">
             <NavItem icon={<Settings size={20}/>} label="Settings" collapsed={isNavCollapsed} />
             <NavItem icon={<LogOut size={20}/>} label="Logout" collapsed={isNavCollapsed} />
          </div>
        </motion.aside>

        {/* Main Content with smooth transition logic */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} // Using key triggers the animation on page/tab change
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-6xl mx-auto space-y-8"
            >
              {/* 1. Progress Overview */}
              <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Progress Overview</h2>
                <div className="space-y-6">
                  <SkillProgress label="Python" percentage={75} color="#4F46E5" />
                  <SkillProgress label="JavaScript" percentage={60} color="#10B981" />
                  <SkillProgress label="React" percentage={mainProgress} color="#3B82F6" />
                </div>
              </section>

              {/* 2. Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Skill Comparison" subtitle="Market gap vs. Your current level">
                  <div className="h-56 flex items-end justify-around pt-6 px-4">
                    <BarGroup label="TS" current={75} target={95} />
                    <BarGroup label="GO" current={40} target={85} />
                    <BarGroup label="NEXT" current={85} target={98} />
                    <BarGroup label="SQL" current={65} target={80} />
                    <BarGroup label="K8S" current={20} target={75} />
                  </div>
                  
                  <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Your Skill</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Demand</span>
                    </div>
                  </div>
                </Card>

                {/* Recommended Skills */}
                <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended Skills</h2>
                      <p className="text-[10px] text-slate-400 font-medium">Based on your gaps and progress</p>
                    </div>
                    <button className="text-indigo-600 text-[10px] font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    <RecommendationItem icon={<Code2 size={16} className="text-red-500" />} title="Advanced JavaScript" subtitle="Critical skill gap identified" tag="HIGH PRIORITY" bgColor="bg-red-50" tagColor="text-red-600" />
                    <RecommendationItem icon={<Database size={16} className="text-orange-500" />} title="Data Structures & Algorithms" subtitle="Strengthen your foundation" tag="MEDIUM PRIORITY" bgColor="bg-orange-50" tagColor="text-orange-600" />
                    <RecommendationItem icon={<Layout size={16} className="text-blue-500" />} title="React Performance Optimization" subtitle="Enhance your expertise" tag="LOW PRIORITY" bgColor="bg-blue-50" tagColor="text-blue-600" />
                    <RecommendationItem icon={<Smartphone size={16} className="text-emerald-500" />} title="Mobile App Development" subtitle="Expand your skill set" tag="RECOMMENDED" bgColor="bg-emerald-50" tagColor="text-emerald-600" />
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

// --- Helper Components (Stay same as original) ---
const RecommendationItem = ({ icon, title, subtitle, tag, bgColor, tagColor }) => (
  <div className={`p-4 rounded-xl border border-slate-50 flex items-center justify-between group hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer`}>
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${bgColor} bg-opacity-60 group-hover:scale-105 transition-transform`}>{icon}</div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 tracking-tight">{title}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-100 ${bgColor} ${tagColor} tracking-tight`}>{tag}</span>
      <button className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-colors">Start Learning</button>
    </div>
  </div>
);

const SkillProgress = ({ label, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tight">
      <span>{label}</span>
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

const NavItem = ({ icon, label, active = false, collapsed = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`
      relative w-full flex items-center transition-all duration-200 rounded-xl font-bold text-sm
      h-11 border border-transparent 
      ${active ? "text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}
    `}
  >
    {active && (
      <motion.div 
        layoutId="sidebarActiveBackground"
        className="absolute inset-0 bg-indigo-50 border border-indigo-100/50 rounded-xl shadow-sm z-0"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    )}
    <div className="relative z-10 flex items-center justify-center w-[70px] pr-6.5 min-w-[70px] shrink-0">
      {icon}
    </div>
    <AnimatePresence mode="popLayout">
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 tracking-tight whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      )}
    </AnimatePresence>
  </button>
);

const Card = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full">
    <h3 className="font-bold text-sm text-slate-900">{title}</h3>
    <p className="text-[10px] text-slate-400 font-medium mb-4 uppercase tracking-tighter">{subtitle}</p>
    <div className="flex-1">{children}</div>
  </div>
);

const BarGroup = ({ label, current, target }) => (
  <div className="flex flex-col items-center gap-3 h-full group cursor-default">
    <div className="flex items-end gap-1.5 h-full">
      <div 
        className="w-2.5 bg-indigo-500 rounded-t-sm transition-all duration-500 hover:brightness-110 shadow-[0_-2px_4px_rgba(99,102,241,0.1)]" 
        style={{ height: `${current}%` }} 
      />
      <div 
        className="w-2.5 bg-slate-200 rounded-t-sm transition-all duration-500 group-hover:bg-slate-300" 
        style={{ height: `${target}%` }} 
      />
    </div>
    <span className="text-[9px] font-black text-slate-400 uppercase group-hover:text-slate-600 transition-colors tracking-tighter">
      {label}
    </span>
  </div>
);

export default Dashboard;