import React from 'react';

const features = [
  {
    title: "AI Skill Analysis",
    desc: "Our advanced algorithm analyzes your current skill set and identifies missing competencies based on your career goals.",
    icon: "📊",
    tag: "AI-Powered",
    color: "bg-indigo-100",
    iconColor: "bg-indigo-600"
  },
  {
    title: "Personalized Recommendations",
    desc: "Get curated learning paths tailored to your skill gaps, learning style, and career objectives.",
    icon: "🎓",
    tag: "Personalized",
    color: "bg-purple-100",
    iconColor: "bg-purple-600"
  },
  {
    title: "AI Video Summarization",
    desc: "Save time with AI-generated summaries of learning videos. Get key insights without watching hours of content.",
    icon: "🎥",
    tag: "Smart",
    color: "bg-pink-100",
    iconColor: "bg-pink-600"
  },
  {
    title: "Progress Tracking Dashboard",
    desc: "Monitor your improvement and learning progress over time with detailed analytics and milestones.",
    icon: "📈",
    tag: "Track",
    color: "bg-blue-100",
    iconColor: "bg-blue-600"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features to Accelerate Your Growth</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Discover how our AI-powered platform helps you identify, learn, and master the skills you need.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className={`${f.color} p-8 rounded-[32px] border border-transparent hover:border-slate-200 transition-all relative overflow-hidden`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`${f.iconColor} text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg`}>
                  {f.icon}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-white rounded-full text-slate-600 shadow-sm">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}