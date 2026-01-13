import type { Category, Question, ShuffledQuestion, Difficulty } from './types';
import questionsData from '@/data/questions.json';

// Category to Language mapping
const CATEGORY_LANGUAGE_MAP: Record<Category, string[]> = {
    'Frontend': ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    'Backend': ['JavaScript', 'Python', 'Java', 'C'],
    'Desktop': ['C', 'Java', 'C++', 'Python'],
    'Mobile': ['Dart', 'Kotlin', 'Swift'],
    'AI/ML': ['Python', 'R', 'C++']
};

// Difficulty weights for scoring
const DIFFICULTY_WEIGHTS: Record<Difficulty, number> = {
    'conceptual': 1.0,
    'applied': 1.3,
    'advanced': 1.6
};

/**
 * Get available languages for a given category
 */
export function getLanguagesForCategory(category: Category): string[] {
    return CATEGORY_LANGUAGE_MAP[category] || [];
}

/**
 * Get all questions for a specific language
 */
export function getQuestionsForLanguage(language: string): Question[] {
    return (questionsData as Question[]).filter(q => q.language === language);
}

/**
 * Select random questions from a pool, excluding previously attempted ones
 */
export function selectRandomQuestions(
    questions: Question[],
    count: number,
    excludeIds: string[] = []
): Question[] {
    // Filter out excluded questions
    const availableQuestions = questions.filter(q => !excludeIds.includes(q.id));

    // If not enough questions available, use all available
    if (availableQuestions.length <= count) {
        return availableQuestions;
    }

    // Shuffle and select
    const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Shuffle the options of a question while tracking the correct answer
 */
export function shuffleOptions(question: Question): ShuffledQuestion {
    const { options, correctIndex, ...rest } = question;

    // Create array of indices
    const indices = options.map((_, i) => i);

    // Shuffle indices
    const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);

    // Create shuffled options
    const shuffledOptions = shuffledIndices.map(i => options[i]);

    // Find new position of correct answer
    const newCorrectIndex = shuffledIndices.indexOf(correctIndex);

    return {
        ...rest,
        options: shuffledOptions,
        correctIndex: newCorrectIndex,
        originalCorrectIndex: correctIndex
    };
}

/**
 * Calculate weighted score based on difficulty
 */
export function calculateScore(
    answers: Map<string, number>,
    questions: ShuffledQuestion[]
): { totalScore: number; maxScore: number; correctAnswers: number } {
    let totalScore = 0;
    let maxScore = 0;
    let correctAnswers = 0;

    questions.forEach(question => {
        const weight = DIFFICULTY_WEIGHTS[question.difficulty];
        maxScore += weight;

        const userAnswer = answers.get(question.id);
        if (userAnswer !== undefined && userAnswer === question.correctIndex) {
            totalScore += weight;
            correctAnswers++;
        }
    });

    return { totalScore, maxScore, correctAnswers };
}

/**
 * Calculate final rating (1-10 integer)
 */
export function calculateRating(score: number, maxScore: number): number {
    if (maxScore === 0) return 1;

    const rawRating = (score / maxScore) * 10;
    const clampedRating = Math.max(1, Math.min(10, rawRating));

    return Math.round(clampedRating);
}

/**
 * Get question count based on skill level
 */
export function getQuestionCount(skillLevel: 'beginner' | 'intermediate' | 'professional'): number {
    switch (skillLevel) {
        case 'beginner':
            return 0;
        case 'intermediate':
            return 5;
        case 'professional':
            return 7;
        default:
            return 0;
    }
}
