export default function HowItWorks() {
  const steps = [
    { num: 1, title: "Sign Up & Access", desc: "Create your account and complete our AI-powered skill assessment." },
    { num: 2, title: "Get Your Learning Path", desc: "Receive a personalized roadmap with curated learning resources." },
    { num: 3, title: "Learn & Track Progress", desc: "Start learning and monitor your growth through your dashboard." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#fbfcfe]">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-2">How It Works</h2>
        <p className="text-slate-500 mb-20">Start your learning journey in three simple steps.</p>
        
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step) => (
            <div key={step.num} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-100 mb-8">
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}