"use client";
import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Menu, LayoutDashboard, BookOpen, Pencil, 
  History, Settings, LogOut, Zap, Code2, Database, Layout, 
  Smartphone, Cpu, Globe, Server, Container, GitBranch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const BrowsePage = () => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) {
      setNavCollapsed(saved === "true");
    }
    setIsMounted(true);
  }, []);

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", newState);
      return newState;
    });
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-[60] bg-white border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleNav} 
            className="p-1.5 hover:bg-slate-50 rounded-md text-slate-500 transition-colors"
          >
            <Menu size={18} />
          </motion.button>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-100">S</div>
            <span className="font-bold text-slate-900 tracking-tight hidden sm:block">SkillGap</span>
          </motion.div>
        </div>
        
        <div className="flex-1 max-w-xl px-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search for new skills..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-600 rounded-full border-2 border-white"></span>
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=User&background=6366f1&color=fff" alt="Profile" />
          </motion.div>
        </div>
      </motion.nav>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
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

            <NavItem 
              icon={<BookOpen size={20}/>} 
              label="Browse" 
              active={activeTab === 'browse'} 
              collapsed={isNavCollapsed} 
              onClick={() => setActiveTab('browse')}
            />

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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            
            <motion.div 
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto space-y-12"
            >
              <motion.section variants={itemVariants} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Skill Recommendations</h1>
                  <p className="text-sm text-slate-500">Personalized suggestions to accelerate your career growth</p>
                </div>
                
                <motion.section variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended Skills</h2>
                      <p className="text-[10px] text-slate-400 font-medium">Based on your gaps and progress</p>
                    </div>
                    <button className="text-indigo-600 text-[10px] font-bold hover:underline">View All</button>
                  </div>
                  <motion.div variants={containerVariants} className="space-y-3">
                    <ListItem variants={itemVariants} icon={<Code2 size={16} className="text-red-500" />} title="Advanced JavaScript" subtitle="Critical skill gap identified" tag="HIGH PRIORITY" bgColor="bg-red-50" tagColor="text-red-600" />
                    <ListItem variants={itemVariants} icon={<Layout size={16} className="text-blue-500" />} title="React Performance" subtitle="Enhance your expertise" tag="LOW PRIORITY" bgColor="bg-blue-50" tagColor="text-blue-600" />
                    <ListItem variants={itemVariants} icon={<Database size={16} className="text-orange-500" />} title="Data Structures & Algorithms" subtitle="Strengthen your foundation" tag="MEDIUM PRIORITY" bgColor="bg-orange-50" tagColor="text-orange-600" />
                    <ListItem variants={itemVariants} icon={<Smartphone size={16} className="text-emerald-500" />} title="Mobile App Development" subtitle="Expand your skill set" tag="RECOMMENDED" bgColor="bg-emerald-50" tagColor="text-emerald-600" />
                    <ListItem variants={itemVariants} icon={<Zap size={16} className="text-purple-500" />} title="System Design" subtitle="Architect scalable software" tag="HIGH PRIORITY" bgColor="bg-purple-50" tagColor="text-purple-600" />
                  </motion.div>
                </motion.section>

                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SkillCard variants={itemVariants} icon={<Globe className="text-indigo-500"/>} title="Java" priority="High Priority" desc="Java is essential for backend development and enterprise applications." />
                  <SkillCard variants={itemVariants} icon={<Database className="text-emerald-500"/>} title="DBMS" priority="High Priority" desc="Understanding DBMS concepts is fundamental for any developer role." />
                  <SkillCard variants={itemVariants} icon={<Cpu className="text-orange-500"/>} title="Node.js" priority="Medium Priority" desc="Node.js enables JavaScript on the server-side, making you a full-stack developer." />
                  <SkillCard variants={itemVariants} icon={<Layout className="text-blue-500"/>} title="React" priority="Medium Priority" desc="React is the most popular frontend library for building user interfaces." />
                  <SkillCard variants={itemVariants} icon={<GitBranch className="text-red-500"/>} title="Git & GitHub" priority="High Priority" desc="Version control with Git is mandatory for all developers." />
                  <SkillCard variants={itemVariants} icon={<Container className="text-indigo-400"/>} title="Docker" priority="Low Priority" desc="Docker streamlines application deployment through containerization." />
                  <SkillCard variants={itemVariants} icon={<Server className="text-orange-500"/>} title="AWS" priority="Low Priority" desc="Amazon Web Services is the leading cloud platform." />
                  <SkillCard variants={itemVariants} icon={<Cpu className="text-purple-500"/>} title="Machine Learning" priority="Low Priority" desc="An advanced skill for those interested in AI and data science." />
                  <SkillCard variants={itemVariants} icon={<Container className="text-blue-400"/>} title="Kubernetes" priority="Medium Priority" desc="Master container orchestration at scale." />
                  <SkillCard variants={itemVariants} icon={<Layout className="text-pink-500"/>} title="Tailwind CSS" priority="Medium Priority" desc="Rapidly build modern websites with utility-first CSS." />
                  <SkillCard variants={itemVariants} icon={<Smartphone className="text-cyan-500"/>} title="Next.js" priority="High Priority" desc="The React framework for production and high performance." />
                  <SkillCard variants={itemVariants} icon={<Code2 className="text-yellow-500"/>} title="TypeScript" priority="High Priority" desc="Add static typing to JavaScript for better reliability." />
                </motion.div>
              </motion.section>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- Helper Components ---

const SkillCard = ({ icon, title, priority, desc, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-4 hover:border-indigo-100 transition-colors group"
  >
    <div className="w-full flex justify-end">
      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${priority.includes('High') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-orange-50 text-orange-500 border-orange-100'}`}>{priority}</span>
    </div>
    <motion.div whileHover={{ rotate: 10 }} className="p-4 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">{icon}</motion.div>
    <div className="space-y-1">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed px-2">{desc}</p>
    </div>
    <motion.button whileTap={{ scale: 0.95 }} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors mt-2">Start Learning</motion.button>
  </motion.div>
);

const ListItem = ({ icon, title, subtitle, tag, bgColor, tagColor, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ x: 5 }}
    className="p-4 rounded-xl border border-slate-50 flex items-center justify-between group hover:shadow-sm hover:bg-white hover:border-slate-100 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${bgColor} bg-opacity-60`}>{icon}</div>
      <div>
        <h4 className="text-xs font-bold text-slate-800">{title}</h4>
        <p className="text-[10px] text-slate-400 font-medium">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-100 ${bgColor} ${tagColor}`}>{tag}</span>
      <motion.button whileTap={{ scale: 0.95 }} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold hover:bg-indigo-700">Start Learning</motion.button>
    </div>
  </motion.div>
);

const NavItem = ({ icon, label, active = false, collapsed = false, onClick }) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      relative w-full flex items-center transition-all duration-200 rounded-xl font-bold text-sm
      h-11 border border-transparent overflow-hidden
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
  </motion.button>
);

export default BrowsePage;