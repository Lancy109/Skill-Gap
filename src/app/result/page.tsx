"use client";

import React, { Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RotateCw, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { calculateScore, calculateRating } from '@/lib/skillEngine';
import { questions as allQuestions } from '@/lib/questions';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const level = searchParams.get('level') || 'beginner';
    const lang = searchParams.get('lang') || 'React';
    const domain = searchParams.get('domain') || 'Frontend';
    const answersStr = searchParams.get('a');
    const qIdsStr = searchParams.get('q');

    // Calculate Score
    const result = useMemo(() => {
        if (level === 'beginner') return { rating: 1, score: 0, maxScore: 0 };

        try {
            const answers = answersStr ? JSON.parse(answersStr) : {};
            const qIds = qIdsStr ? JSON.parse(qIdsStr) : [];
            const quizQuestions = allQuestions.filter(q => qIds.includes(q.id));

            const { totalScore, maxScore } = calculateScore(answers, quizQuestions);
            const rating = calculateRating(totalScore, maxScore);
            return { rating, score: totalScore, maxScore };
        } catch (e) {
            return { rating: 1, score: 0, maxScore: 0 };
        }
    }, [answersStr, qIdsStr, level]);

    const ratingColor = result.rating >= 8 ? 'text-emerald-500' : result.rating >= 5 ? 'text-amber-500' : 'text-red-500';
    const ringColor = result.rating >= 8 ? 'stroke-emerald-500' : result.rating >= 5 ? 'stroke-amber-500' : 'stroke-red-500';

    return (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="max-w-2xl w-full space-y-8">

                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                    <span className="inline-block px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                        Assessment Complete
                    </span>

                    <h1 className="text-2xl font-bold text-slate-900 mb-1">{lang} / {domain}</h1>
                    <p className="text-slate-500 text-sm mb-8 capitalize">{level} Level</p>

                    {level !== 'beginner' ? (
                        <div className="flex justify-center mb-8">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* SVG Ring */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * result.rating) / 10}
                                        className={`${ringColor} transition-all duration-1000 ease-out`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-5xl font-black ${ratingColor}`}>{result.rating}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">out of 10</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 p-6 bg-indigo-50 rounded-2xl">
                            <h3 className="text-indigo-900 font-bold mb-2">Welcome to your journey!</h3>
                            <p className="text-indigo-600 text-sm">Since you're starting as a beginner, we've skipped the quiz to focus on your learning path.</p>
                        </div>
                    )}

                    <p className="text-slate-600 max-w-sm mx-auto text-sm leading-relaxed mb-8">
                        {result.rating >= 8 ? "Excellent work! You have a strong command of the concepts. Focus on advanced patterns and system design next." :
                            result.rating >= 5 ? "Solid foundation. You have good applied knowledge but missed some deeper conceptual or advanced nuances." :
                                "Keep learning! Building strong foundations takes time. Your final skill rating has been calibrated based on difficulty weights and conceptual accuracy."}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/skill-input')}
                            className="px-6 py-3 bg-slate-50 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-100 flex items-center gap-2 transition-colors"
                        >
                            <RotateCw size={16} /> Retake
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200">
                            Dashboard <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>

                {/* Roadmap */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-xl">👑</span>
                        <h3 className="font-bold text-slate-900">Recommended Path Forward</h3>
                    </div>

                    <div className="space-y-6 relative pl-3">
                        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100" />

                        <RoadmapItem
                            title="Advanced Patterns"
                            desc="Context managers, decorators, and metaclasses."
                        />
                        <RoadmapItem
                            title="Concurrency & Parallelism"
                            desc="Asyncio, multiprocessing, and threading strategies."
                        />
                        <RoadmapItem
                            title="Data Engineering"
                            desc="Pandas optimization, PySpark, and Airflow pipelines."
                        />
                        <RoadmapItem
                            title="AI/ML Integration"
                            desc="Custom PyTorch layers, Model deployment with FastAPI."
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}

const RoadmapItem = ({ title, desc }) => (
    <div className="flex gap-6 relative z-10 group">
        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:border-indigo-500 group-hover:bg-indigo-50 transition-colors">
            <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-indigo-600 transition-colors" />
        </div>
        <div>
            <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        </div>
    </div>
);


const ResultPage = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-700 font-sans">
            <Navbar onToggleNav={() => { }} />
            <Suspense fallback={<div>Calculating...</div>}>
                <ResultContent />
            </Suspense>
        </div>
    );
};

export default ResultPage;
