"use client";
import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, Clock, Calendar, 
  ChevronRight, CheckCircle2, Filter, Trash2, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar'; 
import Sidebar from '@/components/Sidebar';

const HistoryPage = () => {
  const router = useRouter();
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("nav-collapsed");
    if (saved !== null) setNavCollapsed(saved === "true");
    setIsMounted(true);
    
    loadLocalHistory();

    // Listen for storage changes in case user completes a video in another tab
    window.addEventListener("storageProgressUpdate", loadLocalHistory);
    return () => window.removeEventListener("storageProgressUpdate", loadLocalHistory);
  }, []);

  const loadLocalHistory = () => {
    const localData = JSON.parse(localStorage.getItem("skill-gap-progress") || "{}");
    
    // Transform the skill-gap object into an array for the list
    const items = Object.entries(localData).map(([skill, data]: [string, any]) => ({
      type: "course",
      title: skill,
      creator: "Platform Instructor", // You can expand your registry to include names
      date: data.lastUpdated || "Recently viewed",
      duration: `${data.watched?.length || 0} of ${data.total} lessons`,
      status: data.watched?.length === data.total ? "Finished" : "In Progress",
      progress: Math.round(((data.watched?.length || 0) / (data.total || 1)) * 100),
      icon: data.watched?.length === data.total ? 
        <CheckCircle2 size={18} className="text-emerald-600" /> : 
        <PlayCircle size={18} className="text-indigo-600" />
    }));

    // Sort by progress (highest first) or add a timestamp to your data to sort by "Last Viewed"
    setHistoryItems(items.sort((a, b) => b.progress - a.progress));
  };

  const handleToggleNav = () => {
    setNavCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem("nav-collapsed", String(newState));
      return newState;
    });
  };

  const clearHistory = () => {
    if(confirm("Are you sure you want to clear your learning progress?")) {
        localStorage.removeItem("skill-gap-progress");
        loadLocalHistory();
        window.dispatchEvent(new Event("storageProgressUpdate"));
    }
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      <Navbar onToggleNav={handleToggleNav} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isNavCollapsed} />

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div 
              key="history-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    Watch History
                  </h1>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Continue where you left off in your learning paths.</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={clearHistory}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all"
                    >
                        <Trash2 size={14} /> Clear all history
                    </button>
                    <div className="h-4 w-[1px] bg-slate-200 mx-2" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                        <Filter size={14} /> Filter
                    </button>
                </div>
              </header>

              <div className="space-y-3">
                {historyItems.length > 0 ? (
                  historyItems.map((item, idx) => (
                    <HistoryRow 
                        key={idx} 
                        item={item} 
                        onClick={() => router.push(`/browse?skill=${encodeURIComponent(item.title)}`)}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-4">
                        <Search className="text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold">No history found</h3>
                    <p className="text-slate-500 text-sm mt-1">Start a course from the browse page to see it here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// --- History Row Component ---
const HistoryRow = ({ item, onClick }: any) => (
  <motion.div 
    whileHover={{ x: 4 }}
    onClick={onClick}
    className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-5 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
  >
    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-indigo-50 transition-colors shrink-0">
      {item.icon}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
          item.status === 'Finished' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
        }`}>
          {item.status}
        </span>
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
          <Calendar size={10} /> {item.date}
        </span>
      </div>
      <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-indigo-600 transition-colors">{item.title}</h3>
      <p className="text-[11px] text-slate-400 font-medium tracking-tight">Skill Path</p>
    </div>

    <div className="hidden sm:flex flex-col items-end gap-1.5 w-40">
      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
        <Clock size={10} /> {item.duration}
      </span>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${item.progress}%` }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className={`h-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
        />
      </div>
    </div>

    <div className="shrink-0">
      <div className="p-2 group-hover:bg-indigo-50 rounded-lg text-slate-300 group-hover:text-indigo-600 transition-all">
        <ChevronRight size={18} />
      </div>
    </div>
  </motion.div>
);

export default HistoryPage;