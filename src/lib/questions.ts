export type Difficulty = 'conceptual' | 'applied' | 'advanced';

export interface Question {
    id: string;
    language: string;
    difficulty: Difficulty;
    points: number;
    text: string;
    options: string[];
    correctIndex: number;
}

export const questions: Question[] = [
    // --- FRONTEND ---
    // React
    {
        id: 'react-1',
        language: 'React',
        difficulty: 'conceptual',
        points: 10,
        text: "What is the Virtual DOM in React primarily used for?",
        options: ['Optimizing DOM updates by minimizing direct reflows/repaints', 'Directly manipulating browser DOM', 'Storing database records', 'Managing CSS styles'],
        correctIndex: 0
    },
    {
        id: 'react-2',
        language: 'React',
        difficulty: 'conceptual',
        points: 10,
        text: "Which data binding model does React primarily use?",
        options: ['One-way data binding', 'Two-way data binding', 'Three-way data binding', 'No binding'],
        correctIndex: 0
    },
    {
        id: 'react-3',
        language: 'React',
        difficulty: 'applied',
        points: 13,
        text: "Which hook would you use to perform side effects in a functional component?",
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctIndex: 0
    },
    {
        id: 'react-4',
        language: 'React',
        difficulty: 'applied',
        points: 13,
        text: "Which statement is true regarding Props in React?",
        options: ['Props are mutable', 'Props are immutable (read-only)', 'Props are global state', 'Props can be changed by child'],
        correctIndex: 1
    },
    {
        id: 'react-5',
        language: 'React',
        difficulty: 'advanced',
        points: 16,
        text: "Which hook is best for preventing unnecessary re-creations of a function on every render?",
        options: ['useMemo', 'useCallback', 'useRef', 'useEffect'],
        correctIndex: 1
    },
    {
        id: 'react-6',
        language: 'React',
        difficulty: 'advanced',
        text: "What distinguishes Server Components from Client Components?",
        points: 16,
        options: ['Server Components never hydrate on the client', 'Server Components assume client interactivity', 'Server Components cannot fetch data', 'There is no difference'],
        correctIndex: 0
    },
    {
        id: 'react-7',
        language: 'React',
        difficulty: 'advanced',
        text: "What is the process of attaching event listeners to the DOM after initial HTML render called?",
        points: 16,
        options: ['Hydration', 'Compilation', 'Transpilation', 'Minification'],
        correctIndex: 0
    },

    // Vue
    {
        id: 'vue-1',
        language: 'Vue',
        difficulty: 'conceptual',
        text: "Which directive is used for two-way data binding in Vue?",
        points: 10,
        options: ['v-if', 'v-show', 'v-for', 'v-model'],
        correctIndex: 3
    },
    {
        id: 'vue-2',
        language: 'Vue',
        difficulty: 'applied',
        text: "What is the recommended state management library for modern Vue 3 apps?",
        points: 13,
        options: ['Vuex', 'Pinia', 'Redux', 'MobX'],
        correctIndex: 1
    },
    {
        id: 'vue-3',
        language: 'Vue',
        difficulty: 'advanced',
        text: "Which API was introduced in Vue 3 for better logic reuse?",
        points: 16,
        options: ['Composition API', 'Options API', 'Class API', 'Module API'],
        correctIndex: 0
    },

    // --- BACKEND ---
    // Python
    {
        id: 'py-1',
        language: 'Python',
        difficulty: 'conceptual',
        text: "Which of the following data types is mutable in Python?",
        points: 10,
        options: ['List', 'Tuple', 'String', 'Int'],
        correctIndex: 0
    },
    {
        id: 'py-2',
        language: 'Python',
        difficulty: 'applied',
        text: "What syntax is used to apply a decorator to a function?",
        points: 13,
        options: ['@decorator', '#comment', '$variable', '&reference'],
        correctIndex: 0
    },
    {
        id: 'py-3',
        language: 'Python',
        difficulty: 'advanced',
        text: "What is the GIL in CPython?",
        points: 16,
        options: ['Global Interpreter Lock - prevents multiple threads from executing Python bytecode at once', 'Global Interface Loader', 'General Instruction Logic', 'Garbage Integration Layer'],
        correctIndex: 0
    },
    {
        id: 'py-4',
        language: 'Python',
        difficulty: 'conceptual',
        text: "Which PEP provides the style guide for Python code?",
        points: 10,
        options: ['PEP 8', 'PEP 20', 'PEP 257', 'PEP 484'],
        correctIndex: 0
    },
    {
        id: 'py-5',
        language: 'Python',
        difficulty: 'applied',
        text: "Which framework is known for high-performance async APIs?",
        points: 13,
        options: ['Flask', 'Django', 'FastAPI', 'Pyramid'],
        correctIndex: 2
    },
    {
        id: 'py-6',
        language: 'Python',
        difficulty: 'advanced',
        text: "What does 'yield' keyword do in a function?",
        points: 16,
        options: ['Returns a replacement function', 'Terminates the loop', 'Pauses execution and turns function into a generator', 'Throws an exception'],
        correctIndex: 2
    },
    {
        id: 'py-7',
        language: 'Python',
        difficulty: 'advanced',
        text: "Which module is standard for asynchronous I/O in Python?",
        points: 16,
        options: ['asyncio', 'threading', 'multiprocessing', 'socket'],
        correctIndex: 0
    },


    // Go
    {
        id: 'go-1',
        language: 'Go',
        difficulty: 'conceptual',
        text: "What is a Goroutine?",
        points: 10,
        options: ['A lightweight thread managed by Go runtime', 'An OS process', 'A hardware thread', 'A callback function'],
        correctIndex: 0
    },

    // --- MOBILE ---
    // Swift
    {
        id: 'swift-1',
        language: 'Swift',
        difficulty: 'conceptual',
        text: "In Swift, are Structs value types or reference types?",
        points: 10,
        options: ['Value types', 'Reference types', 'Hybrid types', 'Pointer types'],
        correctIndex: 0
    },

    // --- AI/ML ---
    // AI/ML - General
    {
        id: 'ai-1',
        language: 'AI/ML',
        difficulty: 'conceptual',
        text: "Which type of learning involves labeled training data?",
        points: 10,
        options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Clustering'],
        correctIndex: 0
    }
];
