"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight } from 'lucide-react';
import { Question, getRandomQuestions } from '@/lib/skillEngine';
// Note: We need to import questions from the correct file or ensure skillEngine exports it or just use the logic
// In previous steps I updated skillEngine/questions interactions. 
// I'll stick to the working quiz implementation.

function QuizContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Params
    const level = searchParams.get('level') || 'intermediate';
    const lang = searchParams.get('lang') || 'React';
    const domain = searchParams.get('domain') || 'Frontend';

    // State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    // Load Quiz
    useEffect(() => {
        if (level === 'beginner') {
            router.push(`/result?level=${level}&domain=${domain}&lang=${lang}`);
            return;
        }

        const count = level === 'professional' ? 7 : 5;
        // Mock data loading
        const loadedQuestions = getRandomQuestions(lang, count);

        if (loadedQuestions.length === 0) {
            // Fallback if no questions found (for demo resilience)
            const fallback = getRandomQuestions('React', count);
            setQuestions(fallback);
        } else {
            setQuestions(loadedQuestions);
        }
        setLoading(false);
    }, [level, lang, domain, router]);

    const handleAnswer = (qId: string, optionIndex: number) => {
        setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const answersStr = encodeURIComponent(JSON.stringify(answers));
        const qIds = encodeURIComponent(JSON.stringify(questions.map(q => q.id)));

        router.push(`/result?level=${level}&domain=${domain}&lang=${lang}&a=${answersStr}&q=${qIds}`);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>;
    }

    if (questions.length === 0) return <div>No questions found for {lang}.</div>;

    const currentQ = questions[currentQIndex];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans text-slate-700">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{domain} / {lang}</p>
                        <h1 className="text-xl font-bold text-slate-900">Skill Assessment ({level.charAt(0).toUpperCase() + level.slice(1)})</h1>
                    </div>
                    <span className="text-2xl font-black text-slate-200">
                        {currentQIndex + 1}<span className="text-sm text-slate-300">/{questions.length}</span>
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-10 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                    />
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-[32px] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-white"
                    >
                        <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-6 ${currentQ.difficulty === 'advanced' ? 'bg-red-50 text-red-600' :
                                currentQ.difficulty === 'applied' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                            {currentQ.difficulty}
                        </span>

                        <h2 className="text-2xl font-bold text-slate-900 mb-8 leading-tight">
                            {(currentQ as any).text || "Question text missing."}
                        </h2>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => {
                                const isSelected = answers[currentQ.id] === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(currentQ.id, idx)}
                                        className={`w-full p-5 rounded-2xl text-left font-bold text-sm transition-all border-2 group flex items-center justify-between ${isSelected
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                : 'border-slate-50 bg-slate-50 text-slate-600 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border transition-colors ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200 text-slate-400 group-hover:border-indigo-300'
                                                }`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            {opt}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={answers[currentQ.id] === undefined}
                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
                            >
                                {currentQIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

const QuizPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QuizContent />
        </Suspense>
    );
};

export default QuizPage;
