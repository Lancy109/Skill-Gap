"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { User, Mail, Briefcase, Calendar, FileText, Code2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [profileData, setProfileData] = useState<Record<string, string | number | null | undefined> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/profile?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const json = await response.json();
        setProfileData(json);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, isLoaded]);

  if (isLoading || !isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || !profileData) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto w-full text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Profile Unavailable</h1>
        <p className="text-slate-500">Please sign in and complete the setup process to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <User size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500">Manage your learning identity and preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">

        {/* Header Cover Area */}
        <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-600 relative" />

        <div className="px-8 pb-8 relative">
          {/* Avatar floating */}
          <div className="absolute -top-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-md overflow-hidden">
            <Image
              src={user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name || 'user'}`}
              alt={String(profileData.name ?? 'User')}
              width={96}
              height={96}
              className="w-full h-full object-cover rounded-full"
              unoptimized={true}
            />
          </div>

          <div className="pt-16 pb-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profileData.name || "Learning User"}</h2>
              <div className="flex items-center gap-2 text-indigo-600 font-bold mt-1">
                <Code2 size={16} /> <span>Focused on: {profileData.activeSkill || "General Learning"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">

            {/* Info Items */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Email Address</label>
                  <p className="font-bold text-slate-800">{profileData.email || "No email provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Designation</label>
                  <p className="font-bold text-slate-800">{profileData.designation || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Age</label>
                  <p className="font-bold text-slate-800">{profileData.age ? `${profileData.age} Years` : "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Bio Area */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50">
              <div className="flex items-center gap-2 mb-4">
                <FileText size={16} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Professional Bio</h3>
              </div>
              <p className="text-slate-700 leading-relaxed font-medium">
                {profileData.bio || "No biography provided. Tell us about your goals during setup!"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}