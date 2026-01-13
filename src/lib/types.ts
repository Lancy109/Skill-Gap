// Assessment System Types

export type SkillLevel = 'beginner' | 'intermediate' | 'professional';

export type Category = 'Frontend' | 'Backend' | 'Desktop' | 'Mobile' | 'AI/ML';

export type Difficulty = 'conceptual' | 'applied' | 'advanced';

export interface Question {
  id: string;
  category: string;
  language: string;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctIndex: number;
}

export interface ShuffledQuestion extends Omit<Question, 'correctIndex'> {
  correctIndex: number;
  originalCorrectIndex: number;
}

export interface AssessmentState {
  skillLevel: SkillLevel | null;
  category: Category | null;
  language: string | null;
  questions: ShuffledQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, number>;
  attemptedQuestionIds: string[];
}

export interface AssessmentResult {
  skillLevel: SkillLevel;
  category: Category;
  language: string;
  totalScore: number;
  maxScore: number;
  rating: number; // 1-10 integer
  correctAnswers: number;
  totalQuestions: number;
}

export interface RoadmapItem {
  title: string;
  desc: string;
}

export type RoadmapData = Record<string, RoadmapItem[]>;
