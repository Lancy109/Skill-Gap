'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCw, LayoutDashboard, Share2, CheckCircle, Award, BookOpen, ArrowRight } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessmentStore';
import { calculateScore, calculateRating } from '@/lib/assessmentEngine';
import roadmapsData from '@/data/roadmaps.json';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { RoadmapData } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ResultPage() {
    const router = useRouter();
    const {
        skillLevel,
        category,
        language,
        reset,
        questions,
        answers,
        addAttemptedQuestions
    } = useAssessmentStore();

    const [rating, setRating] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Logic for calculating results
        if (!skillLevel) {
            router.push('/assessment');
            return;
        }

        // If beginner, simple logical rating or default
        if (skillLevel === 'beginner') {
            setRating(1);
            return;
        }

        const { shuffleOptions } = require('@/lib/assessmentEngine'); // Use helper if needed, but imported logic is separate

        // Calculate score
        const { totalScore, maxScore } = calculateScore(answers, questions);
        const calculatedRating = calculateRating(totalScore, maxScore);

        setRating(calculatedRating);

        // Add questions to history so they aren't repeated immediately
        addAttemptedQuestions(questions.map(q => q.id));

    }, [skillLevel, answers, questions, router, addAttemptedQuestions]);

    const handleRetake = () => {
        reset();
        router.push('/assessment');
    };

    const handleDashboard = () => {
        router.push('/dashboard');
    };

    // Get roadmap data safely
    const roadmapItems = language && (roadmapsData as unknown as RoadmapData)[language] ? (roadmapsData as unknown as RoadmapData)[language] : [];

    const chartData = {
        labels: ['Score', 'Remaining'],
        datasets: [
            {
                data: [rating, 10 - rating],
                backgroundColor: ['#4f46e5', '#f1f5f9'], // Indigo-600, Slate-100
                borderWidth: 0,
                circumference: 360,
                rotation: 0,
                cutout: '85%',
            },
        ],
    };

    const scoreColor = rating >= 8 ? 'text-green-600' : rating >= 5 ? 'text-indigo-600' : 'text-amber-500';

    return (
        <section className="min-h-screen py-12 px-6 flex justify-center bg-[#fcfdfe]">
            <div className="w-full max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mb-8"
                >
                    <div className="p-10 text-center">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
                            Assessment Complete
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {language} <span className="text-slate-300 font-light">/</span> {category}
                        </h1>
                        <p className="text-slate-500 text-sm capitalize mb-8">{skillLevel} Level</p>

                        <div className="relative w-48 h-48 mx-auto mb-8">
                            <Doughnut
                                data={chartData}
                                options={{ events: [], plugins: { tooltip: { enabled: false }, legend: { display: false } } }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-bold ${scoreColor}`}>{rating}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">out of 10</span>
                            </div>
                        </div>

                        <div className="max-w-md mx-auto mb-8">
                            <p className="font-bold text-slate-900 mb-2">
                                {rating >= 8 ? "Excellent! You're mastering this." :
                                    rating >= 5 ? "Good progress! Keep building." :
                                        "Great start! Foundations take time."}
                            </p>
                            <p className="text-sm text-slate-500">
                                Your final skill rating has been calibrated based on difficulty weights and conceptual accuracy.
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button onClick={handleRetake} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
                                <RefreshCw size={16} /> Retake
                            </button>
                            <button onClick={handleDashboard} className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                                <LayoutDashboard size={16} /> Dashboard
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Roadmap Section */}
                {roadmapItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Award className="text-amber-500" size={24} />
                            <h2 className="text-lg font-bold text-slate-900">Recommended Path Forward</h2>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-100">
                            {roadmapItems.map((item: any, idx: number) => (
                                <div key={idx} className="relative pl-12">
                                    <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center z-10">
                                        <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
