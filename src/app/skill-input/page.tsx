"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Check, X, Sparkles, Briefcase, 
  GraduationCap, User, ChevronRight, Cpu, Target, ArrowLeft
} from 'lucide-react';

export default function ModularSkillInput() {
  const [stage, setStage] = useState('identity'); 
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    type: '',
    target: '',
    skills: [] as string[]
  });
  const [query, setQuery] = useState('');

  // Contextual suggestions based on target role
  const suggestions = ["React", "Python", "TypeScript", "Node.js", "SQL", "AWS", "Figma", "Communication"]
    .filter(s => s.toLowerCase().includes(query.toLowerCase()) && !profile.skills.includes(s));

  const removeSkill = (name: string) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== name) });
  };

  return (
    <section className="py-12 px-6 flex justify-center bg-[#fcfdfe]">
      <div className="w-full max-w-xl">
        
        {/* Progress Navigation */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            {stage !== 'identity' && (
              <button 
                onClick={() => setStage(stage === 'skills' ? 'details' : 'identity')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="flex gap-1.5">
              {['identity', 'details', 'skills'].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
                  stage === s ? 'w-8 bg-indigo-600' : 'w-4 bg-slate-200'
                }`} />
              ))}
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Builder</span>
        </div>

        <motion.div 
          layout 
          className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative"
        >
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: IDENTITY */}
            {stage === 'identity' && (
              <motion.div key="id" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-2xl font-bold text-purple-800 mb-2">Who Are You?</h2>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'student', icon: GraduationCap, label: 'Student', desc: 'Acquiring academic foundations' },
                    { id: 'pro', icon: Briefcase, label: 'Professional', desc: 'Advancing career expertise' },
                    { id: 'newbie', icon: User, label: 'Absolute Beginner', desc: 'Starting from zero knowledge' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { setProfile({...profile, type: item.id}); setStage('details'); }}
                      className="flex items-center gap-5 p-5 rounded-[24px] border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-indigo-600/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white shadow-sm transition-all">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STAGE 2: TARGET ROLE */}
            {stage === 'details' && (
              <motion.div key="det" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Set your destination</h2>
                <p className="text-slate-500 text-sm mb-8">What role are you aiming for in the next 6-12 months?</p>
                <div className="space-y-6">
                  <div className="relative group">
                    <input 
                      autoFocus
                      className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-600/20 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                      placeholder="e.g. Full Stack Engineer"
                      onChange={(e) => setProfile({...profile, target: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={!profile.target}
                    onClick={() => setStage('skills')}
                    className="w-full py-5 bg-slate-900 text-white rounded-[22px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                  >
                    Next: Define Toolkit <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: SKILLS INVENTORY */}
            {stage === 'skills' && (
              <motion.div key="ski" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Current Toolkit</h2>
                <p className="text-slate-500 text-sm mb-8">Add the technologies and skills you already master.</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[22px] border-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white outline-none font-bold text-slate-900 transition-all"
                      placeholder="Search skills..."
                    />
                    <AnimatePresence>
                      {query && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-20 overflow-hidden p-2"
                        >
                          {suggestions.length > 0 ? suggestions.map(s => (
                            <button 
                              key={s} 
                              onClick={() => { setProfile({...profile, skills: [...profile.skills, s]}); setQuery(''); }}
                              className="w-full p-4 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl flex items-center justify-between group"
                            >
                              {s} <Check size={16} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          )) : (
                            <div className="p-4 text-sm text-slate-400 text-center">No matches found. Press enter to add custom.</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Dynamic Tags */}
                  <div className="flex flex-wrap gap-2 min-h-[100px] p-5 bg-slate-50/50 rounded-[28px] border-2 border-dashed border-slate-100">
                    {profile.skills.map(s => (
                      <motion.span 
                        layout
                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                        key={s} 
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 shadow-sm"
                      >
                        {s} <X size={14} className="text-slate-300 cursor-pointer hover:text-red-500 transition-colors" onClick={() => removeSkill(s)} />
                      </motion.span>
                    ))}
                    {profile.skills.length === 0 && (
                      <div className="m-auto text-center">
                        <p className="text-xs text-slate-400 font-medium tracking-tight uppercase">Your inventory is empty</p>
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={profile.skills.length === 0}
                    onClick={() => { setLoading(true); /* Handle final logic */ }}
                    className="w-full py-5 bg-indigo-600 text-white rounded-[22px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                  >
                    {loading ? "Architecting Roadmap..." : "Generate Roadmap"} <Sparkles size={18} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}