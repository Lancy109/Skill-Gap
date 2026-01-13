'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, User, ChevronRight } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessmentStore';
import type { SkillLevel } from '@/lib/types';

export default function AssessmentPage() {
    const router = useRouter();
    const setSkillLevel = useAssessmentStore((state) => state.setSkillLevel);

    const handleSelectLevel = (level: SkillLevel) => {
        setSkillLevel(level);
        router.push('/assessment/select');
    };

    const levels = [
        {
            id: 'beginner' as SkillLevel,
            label: 'Beginner',
            description: 'No MCQs. I want a learning roadmap.',
            icon: User,
            color: 'bg-green-50 text-green-600',
            border: 'hover:border-green-200'
        },
        {
            id: 'intermediate' as SkillLevel,
            label: 'Intermediate',
            description: '5 Questions. Test my applied knowledge.',
            icon: GraduationCap,
            color: 'bg-blue-50 text-blue-600',
            border: 'hover:border-blue-200'
        },
        {
            id: 'professional' as SkillLevel,
            label: 'Professional',
            description: '7 Questions. Challenge my advanced skills.',
            icon: Briefcase,
            color: 'bg-purple-50 text-purple-600',
            border: 'hover:border-purple-200'
        }
    ];

    return (
        <section className="min-h-screen py-20 px-6 flex justify-center bg-[#fcfdfe]">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Assess Your Expertise</h1>
                    <p className="text-slate-500">Select your current experience level to customize your assessment.</p>
                </motion.div>

                <div className="space-y-4">
                    {levels.map((level, index) => (
                        <motion.button
                            key={level.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleSelectLevel(level.id)}
                            className={`w-full flex items-center p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-md transition-all group ${level.border}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${level.color} mr-6 transition-transform group-hover:scale-110`}>
                                <level.icon size={28} />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                    {level.label}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">{level.description}</p>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}
