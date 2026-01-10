"use client";
import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, LayoutDashboard, BookOpen, Pencil, 
  History, Settings, LogOut, PlayCircle, Clock, Calendar, 
  ChevronRight, UserCheck, CheckCircle2, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

const HistoryPage = () => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) setNavCollapsed(saved === "true");
    setIsMounted(true);
  }, []);

  const historyItems = [
    {
      type: "course",
      title: "Advanced System Design: Distributed Architectures",
      creator: "Dr. Aris Thorne",
      date: "Today, 2:45 PM",
      duration: "45 mins watched",
      status: "In Progress",
      progress: 65,
      icon: <PlayCircle size={18} className="text-indigo-600" />
    },
    {
      type: "consultation",
      title: "1-on-1 Strategy Session",
      creator: "Sarah Jenkins",
      date: "Yesterday",
      duration: "Scheduled: Jan 15",
      status: "Confirmed",
      icon: <UserCheck size={18} className="text-emerald-600" />
    },
    {
      type: "course",
      title: "React Performance Optimization",
      creator: "David Chen",
      date: "Oct 24, 2023",
      duration: "Completed",
      status: "Finished",
      progress: 100,
      icon: <CheckCircle2 size={18} className="text-blue-600" />
    },
    {
      type: "course",
      title: "Introduction to Kubernetes",
      creator: "Dr. Aris Thorne",
      date: "Oct 22, 2023",
      duration: "12 mins watched",
      status: "In Progress",
      progress: 15,
      icon: <PlayCircle size={18} className="text-indigo-600" />
    }
  ];

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={() => setNavCollapsed(!isNavCollapsed)} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors">
            <Menu size={18} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">S</div>
            <span className="font-bold text-slate-900 tracking-tight hidden sm:block">SkillGap</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
            <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="Profile" />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <motion.aside 
          animate={{ width: isNavCollapsed ? 70 : 240 }}
          className="border-r border-slate-100 bg-white flex flex-col pt-6 overflow-hidden shrink-0">
          <div className="px-3 space-y-1">

            <Link href="/dashboard" passHref className="block">
              <NavItem 
                icon={<LayoutDashboard size={20}/>} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                collapsed={isNavCollapsed} 
                onClick={() => setActiveTab('dashboard')}
            /> 
            </Link>

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
            <NavItem icon={<History size={20}/>} label="History" active={true} collapsed={isNavCollapsed} />
          </div>
        </motion.aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Activity History</h1>
                <p className="text-sm text-slate-500 mt-1">Review your recent learning and consultation logs.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter size={14} /> Filter
              </button>
            </header>

            <div className="space-y-4">
              {historyItems.map((item, idx) => (
                <HistoryRow key={idx} item={item} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- History Row Component ---
const HistoryRow = ({ item }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-5 hover:border-indigo-100 transition-all group"
  >
    {/* Icon Column */}
    <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors`}>
      {item.icon}
    </div>

    {/* Details Column */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
          item.type === 'course' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {item.type}
        </span>
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Calendar size={10} /> {item.date}
        </span>
      </div>
      <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
      <p className="text-xs text-slate-400">Led by {item.creator}</p>
    </div>

    {/* Progress/Status Column */}
    <div className="hidden sm:flex flex-col items-end gap-1.5 w-32">
      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
        <Clock size={10} /> {item.duration}
      </span>
      {item.type === 'course' && (
        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000" 
            style={{ width: `${item.progress}%` }} 
          />
        </div>
      )}
    </div>

    {/* Action Column */}
    <div className="shrink-0">
      <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-indigo-600 transition-all">
        <ChevronRight size={18} />
      </button>
    </div>
  </motion.div>
);

// --- Reuse NavItem from previous pages ---
const NavItem = ({ icon, label, active = false, collapsed = false }) => (
  <button className={`relative w-full flex items-center transition-all duration-200 rounded-xl font-bold text-sm h-11 ${active ? "text-indigo-600 bg-indigo-50 shadow-sm" : "text-slate-400 hover:bg-slate-50"}`}>
    <div className="flex items-center justify-center w-[70px] pr-6.5 shrink-0">{icon}</div>
    {!collapsed && <span className="tracking-tight">{label}</span>}
  </button>
);

export default HistoryPage;