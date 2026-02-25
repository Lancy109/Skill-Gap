"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, ChevronDown, BookOpen, User as UserIcon, Target } from 'lucide-react';
import Link from "next/link";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const AVAILABLE_COURSES = [
  "Python", "C", "Advanced JavaScript", "NodeJS", "Java", "SQL", "Kotlin",
  "TypeScript", "C++", "Swift", "Flutter", "React", "HTML & CSS"
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Welcome to SkillGap!', desc: 'Explore courses to start your journey.', time: '2h ago', icon: <UserIcon size={16} />, unread: true },
  { id: 2, title: 'New Playlist Available', desc: 'A new Advanced React playlist was just added.', time: '1d ago', icon: <BookOpen size={16} />, unread: true },
  { id: 3, title: 'Goal Reminder', desc: 'You are close to finishing the Python Basics module.', time: '3d ago', icon: <Target size={16} />, unread: false }
];

const Navbar = ({ onToggleNav }: { onToggleNav: () => void }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [userLevel, setUserLevel] = useState("NEWBIE"); // Default fallback
  const [userName, setUserName] = useState("User");

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  useEffect(() => {
    // Sync with the database via profile API
    const fetchProfile = async () => {
      if (isLoaded && user) {
        try {
          const res = await fetch(`/api/profile?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserName(data.name || user.firstName || "User");
            setUserLevel((data.designation || "STUDENT").toUpperCase());
          }
        } catch (e) {
          console.error("Failed to fetch profile for Navbar", e);
        }
      }
    };

    fetchProfile();
  }, [isLoaded, user]);

  useEffect(() => {
    // Close dropdowns when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to determine badge color based on level
  const getLevelColor = (level: string) => {
    if (level.includes('EXPERT') || level.includes('SENIOR') || level.includes('LEAD')) return 'text-purple-600 bg-purple-50 border-purple-100';
    if (level.includes('INTERMEDIATE') || level.includes('DEVELOPER')) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-slate-500 bg-slate-100 border-slate-200';
  };

  const filteredCourses = AVAILABLE_COURSES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearchSelect = (course: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    router.push(`/browse?skill=${encodeURIComponent(course)}`);
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
      <div className="flex-1 max-w-md px-8 hidden md:block relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} // delay to allow clicks
            className="w-full bg-slate-100/50 border border-transparent rounded-lg py-1.5 pl-9 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute top-12 left-8 right-8 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2"
            >
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => (
                  <div
                    key={course}
                    onClick={() => handleSearchSelect(course)}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-3 text-sm font-medium text-slate-700"
                  >
                    <Search size={14} className="text-slate-400" />
                    {course}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No courses found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-all ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
          >
            <Bell size={18} />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                  <h3 className="font-bold text-slate-900 text-lg tracking-tight">Notifications</h3>
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      {notifications.filter(n => n.unread).length} New
                    </span>
                  )}
                </div>

                <div className="max-h-[340px] overflow-y-auto custom-scrollbar bg-slate-50/30">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className={`p-4 sm:p-5 border-b border-slate-50/50 last:border-0 hover:bg-white cursor-pointer transition-all flex gap-4 ${notif.unread ? 'bg-white shadow-sm relative z-10' : 'opacity-70'}`}
                      >
                        {notif.unread && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
                        )}
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${notif.unread ? 'bg-indigo-100 text-indigo-600 scale-100' : 'bg-slate-100 text-slate-400 scale-95'}`}>
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm tracking-tight truncate ${notif.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap mt-0.5">{notif.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed pr-2">{notif.desc}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Bell size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-600 mb-1">You're all caught up!</p>
                      <p className="text-xs text-slate-400">Check back later for new updates.</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 bg-white border-t border-slate-100/50 text-center">
                    <button
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 w-full"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-slate-100 mx-1"></div>

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