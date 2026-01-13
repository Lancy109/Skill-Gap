"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SkillLevelPage() {
  const router = useRouter();

  const levels = [
    {
      id: 'beginner',
      icon: User,
      label: 'Beginner',
      desc: 'No MCQs. I want a learning roadmap.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'intermediate',
      icon: GraduationCap,
      label: 'Intermediate',
      desc: '5 Questions. Test my applied knowledge.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'professional',
      icon: Briefcase,
      label: 'Professional',
      desc: '7 Questions. Challenge my advanced skills.',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const handleSelect = (level: string) => {
    // Save to localStorage or pass via URL
    if (typeof window !== 'undefined') {
      localStorage.setItem('skill-level', level);
    }
    router.push(`/assessment/setup?level=${level}`);
  };

  return (
    <section className="min-h-screen py-12 px-6 flex flex-col items-center justify-center bg-[#fcfdfe]">
      <div className="w-full max-w-2xl text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Assess Your Expertise</h1>
        <p className="text-slate-500">Select your current experience level to customize your assessment.</p>
      </div>

      <div className="w-full max-w-xl space-y-4">
        {levels.map((level, i) => (
          <motion.button
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(level.id)}
            className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all group text-left"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${level.color} transition-transform group-hover:scale-110`}>
                <level.icon size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{level.label}</h3>
                <p className="text-sm text-slate-500">{level.desc}</p>
              </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </motion.button>
        ))}
      </div>
    </section>
  );
}