import type { Question, Difficulty } from './types';
export type { Difficulty }; // Re-export if needed, or just let consumers import from types

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

    // HTML & CSS questions added to ensure scoring matches JSON dataset
    {
        id: 'html-fe-1',
        language: 'HTML',
        difficulty: 'conceptual',
        points: 10,
        text: "What does HTML stand for?",
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyperlink Text Management', 'Home Tool Markup'],
        correctIndex: 0
    },
    {
        id: 'html-fe-2',
        language: 'HTML',
        difficulty: 'conceptual',
        points: 10,
        text: "Which tag is used for an unordered list?",
        options: ['<ol>', '<ul>', '<li>', '<list>'],
        correctIndex: 1
    },
    {
        id: 'html-fe-3',
        language: 'HTML',
        difficulty: 'applied',
        points: 13,
        text: "Correct HTML for creating a hyperlink?",
        options: ['<a>http://google.com</a>', "<a href='http://google.com'>Google</a>", "<a url='http://google.com'>Google</a>", '<link>http://google.com</link>'],
        correctIndex: 1
    },
    {
        id: 'html-fe-4',
        language: 'HTML',
        difficulty: 'applied',
        points: 13,
        text: "Which tag is used to define an image?",
        options: ['<image>', '<img>', '<picture>', '<src>'],
        correctIndex: 1
    },
    {
        id: 'html-fe-5',
        language: 'HTML',
        difficulty: 'applied',
        points: 13,
        text: "Which character is used to indicate an end tag?",
        options: ['*', '<', '/', '^'],
        correctIndex: 2
    },
    {
        id: 'html-fe-6',
        language: 'HTML',
        difficulty: 'advanced',
        points: 16,
        text: "What is the purpose of the <canvas> element?",
        options: ['To display text', 'To draw graphics via scripting (usually JavaScript)', 'To store data', 'To create forms'],
        correctIndex: 1
    },
    {
        id: 'html-fe-7',
        language: 'HTML',
        difficulty: 'advanced',
        points: 16,
        text: "Which attribute is used to provide an advisory text about an element?",
        options: ['title', 'tooltip', 'alt', 'desc'],
        correctIndex: 0
    },
    {
        id: 'css-fe-1',
        language: 'CSS',
        difficulty: 'conceptual',
        points: 10,
        text: "What does CSS stand for?",
        options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctIndex: 1
    },
    {
        id: 'css-fe-2',
        language: 'CSS',
        difficulty: 'conceptual',
        points: 10,
        text: "Where in an HTML document is the correct place to refer to an external style sheet?",
        options: ['In the <body> section', 'At the end of the document', 'In the <head> section', 'In the <footer> section'],
        correctIndex: 2
    },
    {
        id: 'css-fe-3',
        language: 'CSS',
        difficulty: 'applied',
        points: 13,
        text: "Which property is used to change the background color?",
        options: ['color', 'bgcolor', 'background-color', 'fill'],
        correctIndex: 2
    },
    {
        id: 'css-fe-4',
        language: 'CSS',
        difficulty: 'applied',
        points: 13,
        text: "Which CSS property controls the text size?",
        options: ['text-style', 'font-style', 'text-size', 'font-size'],
        correctIndex: 3
    },
    {
        id: 'css-fe-5',
        language: 'CSS',
        difficulty: 'applied',
        points: 13,
        text: "How do you display hyperlinks without an underline?",
        options: ['a {text-decoration:none;}', 'a {underline:none;}', 'a {text-style:no-underline;}', 'a {decoration:no-underline;}'],
        correctIndex: 0
    },
    {
        id: 'css-fe-6',
        language: 'CSS',
        difficulty: 'advanced',
        points: 16,
        text: "How do you make the text bold?",
        options: ['font:bold;', 'font-weight:bold;', 'style:bold;', 'text-decoration:bold;'],
        correctIndex: 1
    },
    {
        id: 'css-fe-7',
        language: 'CSS',
        difficulty: 'advanced',
        points: 16,
        text: "Which property is used to change the left margin of an element?",
        options: ['padding-left', 'margin-left', 'indent', 'spacing-left'],
        correctIndex: 1
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

// Add HTML & CSS questions
questions.push(
    {
        id: 'htmlcss-1',
        language: 'HTML & CSS',
        difficulty: 'conceptual',
        points: 8,
        text: 'What does the HTML <header> element represent in a document?',
        options: [
            'Introductory content or a set of navigational links',
            'A table header cell',
            'A footer for the document',
            'A script section'
        ],
        correctIndex: 0
    },
    {
        id: 'htmlcss-2',
        language: 'HTML & CSS',
        difficulty: 'applied',
        points: 10,
        text: 'Which CSS property controls the space between an element\'s content and its border?',
        options: ['margin', 'padding', 'gap', 'spacing'],
        correctIndex: 1
    },
    {
        id: 'htmlcss-3',
        language: 'HTML & CSS',
        difficulty: 'applied',
        points: 12,
        text: 'Which semantic element should be used to mark up self-contained content that could be independently distributed or reused?',
        options: ['<div>', '<article>', '<section>', '<span>'],
        correctIndex: 1
    },
    {
        id: 'htmlcss-4',
        language: 'HTML & CSS',
        difficulty: 'advanced',
        points: 16,
        text: 'What is the difference between block and inline elements?',
        options: ['Block elements start on a new line and take full width; inline do not', 'Inline elements always have margins; block elements do not', 'Block elements cannot contain text; inline elements can', 'There is no difference'],
        correctIndex: 0
    },
    {
        id: 'htmlcss-5',
        language: 'HTML & CSS',
        difficulty: 'conceptual',
        points: 8,
        text: 'Which attribute is used to provide alternative text for an image for accessibility?',
        options: ['title', 'alt', 'caption', 'desc'],
        correctIndex: 1
    }
);
