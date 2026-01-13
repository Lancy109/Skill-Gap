import type { Question } from './types';
import questionsData from '@/data/questions.json';

export interface ShuffledQuestion extends Omit<Question, 'correctIndex'> {
    originalCorrectIndex: number;
    // We don't expose the new correctIndex to the client state easily if we want to be secure, 
    // but for this client-side app, we can keep it or handle check logic here.
    // For simplicity, we will just return the shuffled options and keep track of answers by ID.
}

export const DIFFICULTY_WEIGHTS: Record<string, number> = {
    'conceptual': 1.0,
    'applied': 1.3,
    'advanced': 1.6
};

// Get random questions for a language
export function getRandomQuestions(language: string, count: number, excludeIds: string[] = []): Question[] {
    // Normalize language for AI/ML or others if needed, assuming direct match for now
    // For AI/ML, we might map 'Python' to it or have 'AI/ML' as language
    let langQuestions = (questionsData as Question[]).filter(q => q.language === language);

    // If not enough questions specific to language (e.g. AI/ML using Python), fallback or just use what we have.
    // For this demo, assuming we have enough or just return all.
    if (langQuestions.length === 0 && language === 'AI/ML') {
        langQuestions = (questionsData as Question[]).filter(q => q.language === 'Python' || q.language === 'AI/ML');
    }

    const available = langQuestions.filter(q => !excludeIds.includes(q.id));

    // Shuffle available
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Shuffle options for a single question
export function shuffleOptions(question: Question): { question: Question, map: number[] } {
    const indices = question.options.map((_, i) => i);
    const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);

    const shuffledOptions = shuffledIndices.map(i => question.options[i]);

    // The new index of the correct answer
    const newCorrectIndex = shuffledIndices.indexOf(question.correctIndex);

    // We return a new Question object with shuffled options and updated correctIndex
    return {
        question: {
            ...question,
            options: shuffledOptions,
            correctIndex: newCorrectIndex
        },
        map: shuffledIndices
    };
}

export function calculateScore(userAnswers: Record<string, number>, quizQuestions: Question[]) {
    let totalScore = 0;
    let maxScore = 0;

    quizQuestions.forEach(q => {
        const weight = DIFFICULTY_WEIGHTS[q.difficulty] || 1;
        maxScore += weight; // Max weighted score

        const answerIndex = userAnswers[q.id];
        if (answerIndex !== undefined && answerIndex === q.correctIndex) {
            totalScore += weight;
        }
    });

    return { totalScore, maxScore };
}

export function calculateRating(totalScore: number, maxScore: number): number {
    if (maxScore === 0) return 1;
    let raw = (totalScore / maxScore) * 10;
    raw = Math.round(raw);
    return Math.max(1, Math.min(10, raw));
}
