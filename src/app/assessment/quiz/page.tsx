'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useAssessmentStore } from '@/lib/assessmentStore';

export default function QuizPage() {
    const router = useRouter();
    const {
        questions,
        currentQuestionIndex,
        answers,
        setAnswer,
        nextQuestion,
        skillLevel,
        category,
        language
    } = useAssessmentStore();

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const hasAnsweredCurrent = currentQuestion && answers.has(currentQuestion.id);

    // Redirect if no questions loaded (e.g. refresh)
    useEffect(() => {
        if (questions.length === 0) {
            router.push('/assessment');
        }
    }, [questions, router]);

    const handleOptionSelect = (index: number) => {
        if (!currentQuestion) return;
        setAnswer(currentQuestion.id, index);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            router.push('/assessment/result');
        } else {
            nextQuestion();
        }
    };

    if (!currentQuestion) return null;

    return (
        <section className="min-h-screen py-12 px-6 flex justify-center bg-[#fcfdfe]">
            <div className="w-full max-w-3xl">
                {/* Header containing metadata */}
                <div className="flex items-center justify-between mb-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <div>{category} / {language}</div>
                    <div>
                        <span className="text-slate-900">{currentQuestionIndex + 1}</span>
                        <span className="mx-1">/</span>
                        {questions.length}
                    </div>
                </div>

                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-xl font-bold text-slate-900">Skill Assessment ({skillLevel === 'intermediate' ? 'Intermediate' : 'Professional'})</h1>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100"
                    >
                        <div className="mb-8">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${currentQuestion.difficulty === 'conceptual' ? 'bg-blue-50 text-blue-600' :
                                currentQuestion.difficulty === 'applied' ? 'bg-green-50 text-green-600' :
                                    'bg-rose-50 text-rose-600'
                                }`}>
                                {currentQuestion.difficulty}
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = answers.get(currentQuestion.id) === index;
                                const letters = ['A', 'B', 'C', 'D'];

                                return (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.005 }}
                                        whileTap={{ scale: 0.995 }}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`w-full p-4 md:p-5 text-left rounded-2xl border transition-all flex items-start gap-4 ${isSelected
                                            ? 'bg-indigo-50 border-indigo-600 shadow-md ring-1 ring-indigo-600'
                                            : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border transition-colors shrink-0 mt-0.5 ${isSelected
                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                            : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300'
                                            }`}>
                                            {letters[index]}
                                        </div>
                                        <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={!hasAnsweredCurrent}
                        className={`py-4 px-8 rounded-2xl font-bold flex items-center gap-2 transition-all ${hasAnsweredCurrent
                            ? 'bg-slate-900 text-white hover:bg-indigo-600 shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 active:translate-y-0'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isLastQuestion ? 'View Results' : 'Next Question'} <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </section>
    );
}
