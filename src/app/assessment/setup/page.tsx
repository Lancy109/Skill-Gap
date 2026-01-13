"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Database, Smartphone, Cpu, Brain, ArrowRight, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';

function AssessmentSetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const level = searchParams.get('level') || 'beginner';

    const [domain, setDomain] = useState('');
    const [tech, setTech] = useState('');

    const domains = [
        { id: 'Frontend', icon: Layout, color: 'text-blue-600 bg-blue-50' },
        { id: 'Backend', icon: Database, color: 'text-emerald-600 bg-emerald-50' },
        { id: 'Mobile', icon: Smartphone, color: 'text-purple-600 bg-purple-50' },
        { id: 'AI/ML', icon: Brain, color: 'text-rose-600 bg-rose-50' },
        { id: 'Desktop', icon: Cpu, color: 'text-amber-600 bg-amber-50' },
    ];

    const technologies: Record<string, string[]> = {
        'Frontend': ['JavaScript', 'TypeScript', 'HTML/CSS'],
        'Backend': ['JavaScript (Node.js)', 'Python', 'Java', 'C'],
        'Mobile': ['Dart (Flutter)', 'Kotlin (Android)', 'Swift (iOS)'],
        'AI/ML': ['Python', 'R', 'C++'],
        'Desktop': ['C', 'Java', 'C++', 'Python'],
    };

    const handleStart = () => {
        if (domain && tech) {
            router.push(`/quiz?level=${level}&domain=${domain}&lang=${tech}`);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col items-center">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-3">
                        Current Level: {level}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Choose Your Path</h1>
                    <p className="text-slate-500">Select a domain and technology to begin your assessment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

                    {/* Step 1: Domain */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                            <h3 className="font-bold text-slate-800">Select Domain</h3>
                        </div>
                        {domains.map((d) => (
                            <motion.button
                                key={d.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setDomain(d.id); setTech(''); }}
                                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${domain === d.id
                                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600'
                                    : 'border-slate-100 bg-white hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${d.color}`}>
                                    <d.icon size={20} />
                                </div>
                                <span className="font-bold text-slate-700">{d.id}</span>
                                {domain === d.id && <Check size={18} className="ml-auto text-indigo-600" />}
                            </motion.button>
                        ))}
                    </div>

                    {/* Step 2: Tech */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${domain ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                            <h3 className={`font-bold transition-colors ${domain ? 'text-slate-800' : 'text-slate-300'}`}>Select Technology</h3>
                        </div>

                        <AnimatePresence mode="wait">
                            {domain ? (
                                <motion.div
                                    key={domain}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {technologies[domain]?.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTech(t)}
                                            className={`p-4 rounded-xl font-bold text-sm transition-all ${tech === t
                                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 transform scale-105'
                                                : 'bg-white border border-slate-100 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="h-60 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-center p-6">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-2xl">👈</div>
                                    <h4 className="font-bold text-slate-700">Waiting for Selection</h4>
                                    <p className="text-sm text-slate-400 font-medium max-w-[200px]">Please select a domain from the left to view available technologies.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-12 flex justify-end">
                    <button
                        onClick={handleStart}
                        disabled={!domain || !tech}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 disabled:hover:shadow-none disabled:hover:bg-slate-900"
                    >
                        Start Assessment <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const AssessmentSetupPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
            <Navbar onToggleNav={() => { }} />
            <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
                <AssessmentSetupContent />
            </Suspense>
        </div>
    );
};

export default AssessmentSetupPage;
