"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { User, Mail, FileText, ArrowRight, Briefcase, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { updateUserProfile, setUserProfileSetupFlag } from '@/actions/progress';

function ProfileSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();

  const selectedSkill = searchParams.get('skill');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    age: '',
    bio: '',
    activeSkill: selectedSkill || ''
  });

  // 1. Auto-fill Clerk data once authenticated session is active
  useEffect(() => {
    if (isLoaded && user) {
      setFormData(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || ''
      }));
    }
  }, [isLoaded, user]);

  // 2. ONLY ONE instance of handleFinish
  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      // Logic to initialize the skills object optionally with the selected skill
      const payload: any = {
        ...formData,
        skills: {}
      };

      if (selectedSkill) {
        payload.skills[selectedSkill] = { watched: [], total: 10 };
        payload.activeSkill = selectedSkill;
      } else {
        payload.activeSkill = null;
      }

      await updateUserProfile(user.id, payload);

      // Try to mark user as having completed profile setup in Clerk metadata  
      // (doesn't fail profile creation if this step has issues)
      try {
        await setUserProfileSetupFlag(user.id);
      } catch (metadataErr) {
        console.warn('Metadata flag update failed, but profile was created:', metadataErr);
      }

      // Force refresh the storage for the dashboard and redirect
      if (selectedSkill) {
        localStorage.setItem(`current-open-skill-${user.id}`, selectedSkill);
      }
      window.dispatchEvent(new Event("storageProgressUpdate"));

      router.push('/dashboard');
    } catch (err) {
      console.error("Setup error:", err);
      alert("Setup failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 mb-4">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Authenticated Session</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personalize Your Path</h1>
          <p className="text-slate-600 mt-2 font-medium">Setting up your profile for <span className="text-indigo-600 font-bold">{selectedSkill}</span></p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-[40px] border border-white shadow-2xl p-8 md:p-12">
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required value={formData.name}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" readOnly value={formData.email}
                    className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-500 font-medium cursor-not-allowed shadow-sm" />
                </div>
              </div>

              {/* Designation */}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1 group-focus-within:text-indigo-600 transition-colors">Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" required placeholder="e.g. Student / Developer"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })} />
                </div>
              </div>

              {/* Age */}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1 group-focus-within:text-indigo-600 transition-colors">Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="number" required placeholder="Years"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block ml-1 group-focus-within:text-indigo-600 transition-colors">Professional Bio</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-slate-400" size={18} />
                <textarea rows={3} placeholder="Tell us about your learning objectives..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 placeholder:text-slate-400 resize-none shadow-sm"
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50">
              {loading ? "Syncing Profile..." : <>Create My Dashboard <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProfileSetup() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProfileSetupContent />
    </Suspense>
  );
}