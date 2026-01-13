'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AssessmentState, SkillLevel, Category, ShuffledQuestion, AssessmentResult } from './types';

interface AssessmentStore extends AssessmentState {
    // Actions
    setSkillLevel: (level: SkillLevel) => void;
    setCategory: (category: Category) => void;
    setLanguage: (language: string) => void;
    setQuestions: (questions: ShuffledQuestion[]) => void;
    setAnswer: (questionId: string, answerIndex: number) => void;
    nextQuestion: () => void;
    reset: () => void;
    addAttemptedQuestions: (questionIds: string[]) => void;
}

const initialState: AssessmentState = {
    skillLevel: null,
    category: null,
    language: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: new Map(),
    attemptedQuestionIds: []
};

export const useAssessmentStore = create<AssessmentStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            setSkillLevel: (level) => set({ skillLevel: level }),

            setCategory: (category) => set({ category }),

            setLanguage: (language) => set({ language }),

            setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),

            setAnswer: (questionId, answerIndex) => {
                const answers = new Map(get().answers);
                answers.set(questionId, answerIndex);
                set({ answers });
            },

            nextQuestion: () => {
                const { currentQuestionIndex, questions } = get();
                if (currentQuestionIndex < questions.length - 1) {
                    set({ currentQuestionIndex: currentQuestionIndex + 1 });
                }
            },

            addAttemptedQuestions: (questionIds) => {
                const current = get().attemptedQuestionIds;
                set({ attemptedQuestionIds: [...current, ...questionIds] });
            },

            reset: () => set(initialState)
        }),
        {
            name: 'assessment-storage',
            // Custom serialization for Map
            partialize: (state) => ({
                ...state,
                answers: Array.from(state.answers.entries())
            }),
            // Custom deserialization for Map
            onRehydrateStorage: () => (state) => {
                if (state && Array.isArray(state.answers)) {
                    state.answers = new Map(state.answers as any);
                }
            }
        }
    )
);
