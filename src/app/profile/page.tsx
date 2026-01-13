"use client";
import React, { useState, useEffect } from 'react';
import { 
  Camera, Mail, Zap, Edit3, Save, User, BellRing, 
  MessageSquare, BookOpen, GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const ProfilePage = () => {
  const [isNavCollapsed, setNavCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); 
  const [isEditing, setIsEditing] = useState(false);

  // --- DYNAMIC USER DATA ---
  // This state will be populated by the inputs from your "Questions Page"
  const [userData, setUserData] = useState({
    name: "User Name",
    role: "Learning Enthusiast",
    email: "user@example.com",
    bio: "No bio added yet.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=initial",
    preferences: {
      dailyReminders: true,
      newCourses: true,
    }
  });

  useEffect(() => {
    const savedNav = localStorage.getItem("nav-collapsed");
    if (savedNav !== null) setNavCollapsed(savedNav === "true");

    // DATA LOADING LOGIC
    // This looks for data saved by your "Questions Page" or previous edits
    const savedData = localStorage.getItem("user_profile_data");
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
    
    setIsMounted(true);
  }, []);

  const handleSave = () => {
    // Persists the data so it stays unique to this user's browser
    localStorage.setItem("user_profile_data", JSON.stringify(userData));
    setIsEditing(false);
  };

  if (!isMounted) return <div className="min-h-screen bg-[#F8FAFC]" />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
      <Navbar onToggleNav={() => setNavCollapsed(!isNavCollapsed)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isNavCollapsed} />

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* COMPACT TAB NAVIGATION */}
            <div className="flex gap-1 bg-white p-1 rounded-2xl border border-slate-100 w-fit shadow-sm">
              <TabBtn active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<User size={14}/>} label="My Profile" />
              <TabBtn active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={<BellRing size={14}/>} label="Preferences" />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <motion.div 
                  key="personal"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    {/* Header Banner */}
                    <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500" />
                    
                    <div className="px-8 pb-8">
                      <div className="relative flex justify-between items-end -mt-10 mb-6">
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden shadow-lg bg-slate-100">
                             <img src={userData.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                          </div>
                          <button className="absolute -bottom-1 -right-1 p-1.5 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                            <Camera size={12} />
                          </button>
                        </div>
                        
                        {!isEditing ? (
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-bold hover:bg-indigo-600 transition-all shadow-md"
                          >
                            <Edit3 size={14} /> Edit Info
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-bold">Cancel</button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-bold shadow-indigo-200 shadow-lg"><Save size={14} /> Save</button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <InputGroup 
                          label="Full Name" 
                          value={userData.name} 
                          disabled={!isEditing} 
                          onChange={(v) => setUserData({...userData, name: v})} 
                        />
                        <InputGroup 
                          label="Primary Role / Goal" 
                          value={userData.role} 
                          disabled={!isEditing} 
                          onChange={(v) => setUserData({...userData, role: v})} 
                        />
                        <InputGroup 
                          label="Contact Email" 
                          value={userData.email} 
                          disabled={!isEditing} 
                          onChange={(v) => setUserData({...userData, email: v})} 
                        />
                        
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">About Me</label>
                          <textarea 
                            disabled={!isEditing}
                            value={userData.bio}
                            onChange={(e) => setUserData({...userData, bio: e.target.value})}
                            placeholder="Tell us about your learning journey..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all min-h-[120px] disabled:opacity-70 resize-none font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* USER STATUS CARDS (Dynamic display based on user info) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatusCard icon={<BookOpen size={16}/>} label="Status" value="Active Learner" color="text-emerald-500" bg="bg-emerald-50" />
                    <StatusCard icon={<Zap size={16}/>} label="Membership" value="Pro Access" color="text-amber-500" bg="bg-amber-50" />
                    <StatusCard icon={<GraduationCap size={16}/>} label="Certificates" value="4 Earned" color="text-indigo-500" bg="bg-indigo-50" />
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm space-y-6">
                   <div className="border-b border-slate-50 pb-4">
                    <h2 className="text-lg font-black text-slate-900">Platform Preferences</h2>
                    <p className="text-xs text-slate-400 font-medium">Customize how SkillGap interacts with you.</p>
                  </div>
                  <div className="space-y-3">
                    <ToggleRow 
                      label="Learning Reminders" 
                      description="Daily notifications to keep your streak alive." 
                      active={userData.preferences.dailyReminders} 
                      onClick={() => setUserData({...userData, preferences: {...userData.preferences, dailyReminders: !userData.preferences.dailyReminders}})}
                    />
                    <ToggleRow 
                      label="New Course Alerts" 
                      description="Get notified when experts release new content." 
                      active={userData.preferences.newCourses} 
                      onClick={() => setUserData({...userData, preferences: {...userData.preferences, newCourses: !userData.preferences.newCourses}})}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- COMPACT HELPER COMPONENTS ---

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>
    {icon} {label}
  </button>
);

const StatusCard = ({ icon, label, value, color, bg }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
    <div className={`${bg} ${color} p-2.5 rounded-xl`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-black text-slate-900">{value}</p>
    </div>
  </div>
);

const ToggleRow = ({ label, description, active, onClick }) => (
  <div className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50/50 transition-colors">
    <div className="flex gap-4 items-center">
      <div className={`p-2 rounded-lg ${active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
        <MessageSquare size={16} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-400 font-medium">{description}</p>
      </div>
    </div>
    <button onClick={onClick} className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
      <motion.div animate={{ x: active ? 22 : 2 }} className="absolute top-1 w-3 h-3 bg-white rounded-full" />
    </button>
  </div>
);

const InputGroup = ({ label, value, disabled, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      disabled={disabled} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all disabled:opacity-60"
    />
  </div>
);

export default ProfilePage;