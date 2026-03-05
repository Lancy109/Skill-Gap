// Consistent course logos and sizing for History and Browse pages
export const LOGO_SIZE = 48; // pixels

type CourseLogoMap = Record<string, { 
  url: string; 
  bgColor: string;
  bgHex: string;
  label: string;
}>;

export const COURSE_LOGOS: CourseLogoMap = {
  'Python': {
    url: 'https://skillicons.dev/icons?i=python&theme=dark&perline=1',
    bgColor: 'bg-blue-600',
    bgHex: '#2563eb',
    label: 'Python'
  },
  'Java': {
    url: 'https://skillicons.dev/icons?i=java&theme=dark&perline=1',
    bgColor: 'bg-red-600',
    bgHex: '#dc2626',
    label: 'Java'
  },
  'NodeJS': {
    url: 'https://skillicons.dev/icons?i=nodejs&theme=dark&perline=1',
    bgColor: 'bg-green-600',
    bgHex: '#16a34a',
    label: 'Node.js'
  },
  'Node': {
    url: 'https://skillicons.dev/icons?i=nodejs&theme=dark&perline=1',
    bgColor: 'bg-green-600',
    bgHex: '#16a34a',
    label: 'Node.js'
  },
  'React': {
    url: 'https://skillicons.dev/icons?i=react&theme=dark&perline=1',
    bgColor: 'bg-cyan-500',
    bgHex: '#06b6d4',
    label: 'React'
  },
  'HTML & CSS': {
    url: 'https://skillicons.dev/icons?i=html,css&theme=dark&perline=2',
    bgColor: 'bg-orange-600',
    bgHex: '#ea580c',
    label: 'HTML & CSS'
  },
  'HTML': {
    url: 'https://skillicons.dev/icons?i=html5&theme=dark&perline=1',
    bgColor: 'bg-orange-600',
    bgHex: '#ea580c',
    label: 'HTML5'
  },
  'CSS': {
    url: 'https://skillicons.dev/icons?i=css3&theme=dark&perline=1',
    bgColor: 'bg-blue-500',
    bgHex: '#3b82f6',
    label: 'CSS3'
  },
  'JavaScript': {
    url: 'https://skillicons.dev/icons?i=javascript&theme=dark&perline=1',
    bgColor: 'bg-yellow-500',
    bgHex: '#eab308',
    label: 'JavaScript'
  },
  'TypeScript': {
    url: 'https://skillicons.dev/icons?i=typescript&theme=dark&perline=1',
    bgColor: 'bg-blue-700',
    bgHex: '#1d4ed8',
    label: 'TypeScript'
  },
  'C': {
    url: 'https://skillicons.dev/icons?i=c&theme=dark&perline=1',
    bgColor: 'bg-slate-700',
    bgHex: '#3f3f46',
    label: 'C'
  },
  'C++': {
    url: 'https://skillicons.dev/icons?i=cpp&theme=dark&perline=1',
    bgColor: 'bg-blue-800',
    bgHex: '#1e40af',
    label: 'C++'
  },
  'SQL': {
    url: 'https://skillicons.dev/icons?i=mysql&theme=dark&perline=1',
    bgColor: 'bg-blue-500',
    bgHex: '#3b82f6',
    label: 'SQL'
  },
  'Kotlin': {
    url: 'https://skillicons.dev/icons?i=kotlin&theme=dark&perline=1',
    bgColor: 'bg-purple-600',
    bgHex: '#9333ea',
    label: 'Kotlin'
  },
  'Swift': {
    url: 'https://skillicons.dev/icons?i=swift&theme=dark&perline=1',
    bgColor: 'bg-orange-500',
    bgHex: '#f97316',
    label: 'Swift'
  },
  'Flutter': {
    url: 'https://skillicons.dev/icons?i=flutter&theme=dark&perline=1',
    bgColor: 'bg-cyan-600',
    bgHex: '#0891b2',
    label: 'Flutter'
  },
  'Go': {
    url: 'https://skillicons.dev/icons?i=go&theme=dark&perline=1',
    bgColor: 'bg-cyan-600',
    bgHex: '#0891b2',
    label: 'Go'
  },
  'Vue': {
    url: 'https://skillicons.dev/icons?i=vuejs&theme=dark&perline=1',
    bgColor: 'bg-green-600',
    bgHex: '#16a34a',
    label: 'Vue.js'
  },
  'Angular': {
    url: 'https://skillicons.dev/icons?i=angular&theme=dark&perline=1',
    bgColor: 'bg-red-700',
    bgHex: '#b91c1c',
    label: 'Angular'
  },
  'AI/ML': {
    url: 'https://skillicons.dev/icons?i=tensorflow&theme=dark&perline=1',
    bgColor: 'bg-orange-500',
    bgHex: '#f97316',
    label: 'AI/ML'
  }
};

/**
 * Get logo info for a course by name (case-insensitive)
 */
export function getCourseLogo(courseName: string) {
  if (!courseName) {
    return {
      url: 'https://skillicons.dev/icons?i=code&theme=dark&perline=1',
      bgColor: 'bg-slate-600',
      bgHex: '#525252',
      label: 'Code'
    };
  }

  const normalized = courseName.trim();
  
  // Try exact match first
  if (COURSE_LOGOS[normalized]) {
    return COURSE_LOGOS[normalized];
  }

  // Try case-insensitive match
  const key = Object.keys(COURSE_LOGOS).find(k => 
    k.toLowerCase() === normalized.toLowerCase()
  );

  if (key) {
    return COURSE_LOGOS[key];
  }

  // Try partial match (e.g. "Python Track" -> "Python")
  const partial = Object.keys(COURSE_LOGOS).find(k =>
    normalized.toLowerCase().includes(k.toLowerCase()) || 
    k.toLowerCase().includes(normalized.toLowerCase().split(' ')[0])
  );

  if (partial) {
    return COURSE_LOGOS[partial];
  }

  // Fallback
  return {
    url: 'https://skillicons.dev/icons?i=code&theme=dark&perline=1',
    bgColor: 'bg-slate-600',
    bgHex: '#525252',
    label: 'Code'
  };
}
