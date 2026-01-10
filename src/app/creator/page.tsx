"use client";
import React, { useState, useEffect } from 'react';
import { 
  Menu, Search, Bell, LayoutDashboard, BookOpen, Pencil, 
  History, Settings, LogOut, ChevronRight, Briefcase, 
  ShieldCheck, Star, ExternalLink, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

const CreatorPage = () => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('creator');

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) setNavCollapsed(saved === "true");
    setIsMounted(true);
  }, []);

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", newState);
      return newState;
    });
  };

  const creators = [
    { name: "Dr. Aris Thorne", role: "Systems Architect", exp: "14+ Yrs", rating: "4.9", tags: ["Go", "Kubernetes"], avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Sarah Jenkins", role: "Principal UX Lead", exp: "10 Yrs", rating: "5.0", tags: ["Figma", "Research"], avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Marcus Holloway", role: "Security Engineer", exp: "12 Yrs", rating: "4.8", tags: ["Python", "Pentest"], avatar: "https://i.pravatar.cc/150?u=3" },
    { name: "Elena Kovic", role: "Data Scientist", exp: "8 Yrs", rating: "4.7", tags: ["PyTorch", "SQL"], avatar: "https://i.pravatar.cc/150?u=4" },
    { name: "David Chen", role: "Staff Frontend", exp: "11 Yrs", rating: "4.9", tags: ["React", "WebGL"], avatar: "https://i.pravatar.cc/150?u=5" },
    { name: "Aria Montgomery", role: "DevOps Manager", exp: "15 Yrs", rating: "5.0", tags: ["Terraform", "AWS"], avatar: "https://i.pravatar.cc/150?u=6" },
    { name: "Julian Vane", role: "Mobile Architect", exp: "9 Yrs", rating: "4.6", tags: ["Swift", "Kotlin"], avatar: "https://i.pravatar.cc/150?u=7" },
    { name: "Sofia Rossi", role: "AI Ethicist", exp: "7 Yrs", rating: "4.9", tags: ["NLP", "Ethics"], avatar: "https://i.pravatar.cc/150?u=8" },
    { name: "Kevin Zhang", role: "Backend Staff", exp: "13 Yrs", rating: "4.8", tags: ["Java", "Kafka"], avatar: "https://i.pravatar.cc/150?u=9" },
  ];

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      
      {/* Top Navigation Bar (Consistent with Dashboard) */}
      <nav className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={handleToggleNav} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors">
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
              placeholder="Search experts or industries..." 
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
        {/* SIDEBAR (Consistent with Dashboard) */}
        <motion.aside 
          initial={false}
          animate={{ width: isNavCollapsed ? 70 : 240 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="border-r border-slate-100 bg-white flex flex-col pt-6 overflow-hidden shrink-0"
        >
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

            <NavItem 
              icon={<Pencil size={20}/>} 
              label="Creator" 
              active={activeTab === 'creator'} 
              collapsed={isNavCollapsed} 
              onClick={() => setActiveTab('creator')}
            />

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

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Industry Experts</h1>
                <p className="text-slate-500 mt-2">Vetted professionals with years of real-world enterprise experience.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={16} className="text-emerald-500" />
                Vetted Experts Only
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((expert, idx) => (
                <ExpertCard key={idx} expert={expert} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- Professional Expert Card ---
const ExpertCard = ({ expert }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group"
  >
    <div className="flex items-start gap-4 mb-4">   
      <div className="relative shrink-0">
        <img src={expert.avatar} className="w-16 h-16 rounded-xl object-cover border border-slate-100" alt={expert.name} />
        <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm border border-slate-100">
          <ShieldCheck size={14} className="text-emerald-500" />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{expert.name}</h3>
        <p className="text-xs font-semibold text-slate-400">{expert.role}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-tighter">
            <Briefcase size={10} /> {expert.exp}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter">
            <Star size={10} className="fill-amber-600" /> {expert.rating}
          </span>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-6">
      {expert.tags.map((tag, i) => (
        <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
          {tag}
        </span>
      ))}
    </div>

    <div className="grid ">
      <button className="flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl text-[11px] font-bold hover:bg-indigo-400 transition-all">
        View Profile
      </button>
      
    </div>
  </motion.div>
);

// --- Shared NavItem ---
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
    <div className="relative z-10 flex items-center justify-center w-[70px] pr-6.5 shrink-0">
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

export default CreatorPage;