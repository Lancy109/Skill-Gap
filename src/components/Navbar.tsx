"use client";
import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, ChevronDown } from 'lucide-react';
import Link from "next/link";

const Navbar = ({ onToggleNav }) => {
  const [userLevel, setUserLevel] = useState("NEWBIE"); // Default fallback
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Sync with the data saved by your Questions/Profile page
    const syncUser = () => {
      const savedData = localStorage.getItem("user_profile_data");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Assuming your question page saves the level as 'level' or 'role'
        setUserName(parsed.name || "User");
        setUserLevel((parsed.level || "NEWBIE").toUpperCase());
      }
    };

    syncUser();
    // Listen for storage changes in case user updates info in another tab
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  // Helper to determine badge color based on level
  const getLevelColor = (level) => {
    switch (level) {
      case 'EXPERT': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'INTERMEDIATE': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
    }
  };

  return (
    <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 h-14 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleNav}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-all active:scale-95"
        >
          <Menu size={18} />
        </button>
        
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
            S
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base hidden sm:block">
            SkillGap
          </span>
        </Link>
      </div>

      {/* Slimmer Search Bar */}
      <div className="flex-1 max-w-md px-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Search skills..." 
            className="w-full bg-slate-100/50 border border-transparent rounded-lg py-1.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-6 w-[1px] bg-slate-100 mx-1"></div>
        
        {/* DYNAMIC PROFILE TRIGGER */}
        <Link href="/profile" className="flex items-center gap-3 pl-2 pr-1 py-1 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-[11px] font-black text-slate-900 leading-none mb-0.5">{userName}</p>
            <p className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${getLevelColor(userLevel)}`}>
              {userLevel}
            </p>
          </div>
          <ChevronDown size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;