import { create } from 'zustand';
import type { SkillLevel, Category, ShuffledQuestion } from './types';

interface AssessmentStore {
    answers: Map<string, number>;
    skillLevel: SkillLevel | null;
    category: Category | null;
    language: string | null;
    questions: ShuffledQuestion[];
    currentQuestionIndex: number;

    setAnswer: (questionId: string, answerIndex: number) => void;
    setSkillLevel: (level: SkillLevel) => void;
    setCategory: (category: Category) => void;
    setLanguage: (language: string) => void;
    setQuestions: (questions: ShuffledQuestion[]) => void;
    nextQuestion: () => void;
    reset: () => void;
}

export const useAssessmentStore = create<AssessmentStore>((set) => ({
    answers: new Map(),
    skillLevel: 'intermediate',
    category: 'Backend',
    language: 'Python',
    questions: [],
    currentQuestionIndex: 0,

    setAnswer: (id, answerIndex) => set((state) => {
        const newAnswers = new Map(state.answers);
        newAnswers.set(id, answerIndex);
        return { answers: newAnswers };
    }),
    setSkillLevel: (level) => set({ skillLevel: level }),
    setCategory: (category) => set({ category }),
    setLanguage: (language) => set({ language }),
    setQuestions: (questions) => set({ questions, currentQuestionIndex: 0, answers: new Map() }),
    nextQuestion: () => set((state) => ({ currentQuestionIndex: state.currentQuestionIndex + 1 })),
    reset: () => set({
        answers: new Map(),
        skillLevel: null,
        currentQuestionIndex: 0,
        questions: [],
        category: null,
        language: null
    }),
}));
