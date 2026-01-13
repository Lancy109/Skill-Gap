'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Server, Smartphone, Brain, Monitor, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessmentStore';
import { getLanguagesForCategory, getQuestionsForLanguage, selectRandomQuestions, getQuestionCount } from '@/lib/assessmentEngine';
import type { Category } from '@/lib/types';

export default function SelectionPage() {
    const router = useRouter();
    const { skillLevel, setCategory, setLanguage, setQuestions, skillLevel: currentLevel } = useAssessmentStore();
    const [selectedDomain, setSelectedDomain] = useState<Category | null>(null);
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    // Redirect if no skill level selected
    useEffect(() => {
        if (!currentLevel) {
            router.push('/assessment');
        }
    }, [currentLevel, router]);

    const domains = [
        { id: 'Frontend', icon: Layout, color: 'bg-blue-500' },
        { id: 'Backend', icon: Server, color: 'bg-green-500' },
        { id: 'Mobile', icon: Smartphone, color: 'bg-purple-500' },
        { id: 'AI/ML', icon: Brain, color: 'bg-red-500' },
        { id: 'Desktop', icon: Monitor, color: 'bg-amber-500' },
    ];

    const handleDomainSelect = (domain: Category) => {
        setSelectedDomain(domain);
        setCategory(domain);
        setSelectedTech(null); // Reset tech when domain changes
    };

    const handleTechSelect = (tech: string) => {
        setSelectedTech(tech);
        setLanguage(tech);
    };

    const startAssessment = () => {
        if (!selectedDomain || !selectedTech || !skillLevel) return;

        // For beginner, skip questions
        if (skillLevel === 'beginner') {
            router.push('/assessment/result');
            return;
        }

        // For intermediate/professional, generate questions
        const allQuestions = getQuestionsForLanguage(selectedTech);
        const count = getQuestionCount(skillLevel);

        // Select randomized questions
        // Note: In a real app we might pass excluded IDs from history
        const questions = selectRandomQuestions(allQuestions, count, []);

        // Prepare questions (shuffle options for each)
        const { shuffleOptions } = require('@/lib/assessmentEngine');
        const preparedQuestions = questions.map(q => shuffleOptions(q));

        setQuestions(preparedQuestions);
        router.push('/assessment/quiz');
    };

    const availableTechnologies = selectedDomain ? getLanguagesForCategory(selectedDomain) : [];

    return (
        <section className="min-h-screen py-12 px-6 flex justify-center bg-[#fcfdfe]">
            <div className="w-full max-w-5xl">
                <div className="flex items-center justify-between mb-12">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="px-4 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        Current Level: {skillLevel}
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Path</h1>
                    <p className="text-slate-500">Select a domain and technology to begin your assessment.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Step 1: Select Domain */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h2 className="text-lg font-bold text-slate-800">Select Domain</h2>
                        </div>

                        <div className="space-y-3">
                            {domains.map((domain) => (
                                <motion.button
                                    key={domain.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handleDomainSelect(domain.id)}
                                    className={`w-full flex items-center p-4 rounded-xl border transition-all ${selectedDomain === domain.id
                                            ? 'bg-white border-indigo-600 shadow-lg shadow-indigo-50 ring-1 ring-indigo-600'
                                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${domain.color} text-white flex items-center justify-center mr-4 shadow-sm`}>
                                        <domain.icon size={20} />
                                    </div>
                                    <span className={`font-bold ${selectedDomain === domain.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {domain.id}
                                    </span>
                                    {selectedDomain === domain.id && (
                                        <div className="ml-auto text-indigo-600">
                                            <Check size={20} />
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Select Technology */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${selectedDomain ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>2</div>
                            <h2 className={`text-lg font-bold transition-colors ${selectedDomain ? 'text-slate-800' : 'text-slate-300'}`}>Select Technology</h2>
                        </div>

                        <div className={`p-8 rounded-[32px] border-2 border-dashed min-h-[400px] transition-all flex flex-col ${selectedDomain ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100'}`}>
                            <AnimatePresence mode="wait">
                                {!selectedDomain ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex items-center justify-center text-slate-300 font-medium"
                                    >
                                        Select a domain first
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="technologies"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="w-full"
                                    >
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            {availableTechnologies.map((tech) => (
                                                <button
                                                    key={tech}
                                                    onClick={() => handleTechSelect(tech)}
                                                    className={`p-4 rounded-xl text-sm font-bold transition-all ${selectedTech === tech
                                                            ? 'bg-white shadow-md text-indigo-600 ring-2 ring-indigo-600 ring-offset-2 ring-offset-slate-50'
                                                            : 'bg-white shadow-sm text-slate-600 hover:text-slate-900 hover:shadow-md'
                                                        }`}
                                                >
                                                    {tech}
                                                </button>
                                            ))}
                                        </div>

                                        {selectedTech && availableTechnologies.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-auto pt-8 border-t border-slate-200/50"
                                            >
                                                <button
                                                    onClick={startAssessment}
                                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20"
                                                >
                                                    Start Assessment <ArrowRight size={18} />
                                                </button>
                                            </motion.div>
                                        )}
                                        {availableTechnologies.length === 0 && (
                                            <div className="text-center text-slate-400 py-10">
                                                No courses available for this domain yet.
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
