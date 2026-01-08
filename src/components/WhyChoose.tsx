export default function WhyChoose() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Why Choose Skill Gap?
          </h2>

          <ul className="space-y-4 text-gray-600">
            <li>✔ AI-powered precision analysis</li>
            <li>✔ Personalized learning experience</li>
            <li>✔ Visual progress tracking</li>
            <li>✔ Trusted resources & summaries</li>
          </ul>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <p className="text-sm mb-2">📊 Learning Progress</p>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div className="h-2 w-[70%] bg-indigo-600 rounded-full" />
          </div>

          <p className="text-sm mb-1">🔥 7 Day Streak</p>
          <p className="text-xs text-gray-500">
            You’re consistently improving your skills
          </p>
        </div>
      </div>
    </section>
  );
}
