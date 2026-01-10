import React from 'react';
import Link from 'next/link'; //

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 text-center bg-[#fbfcfe]">
      <div className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full">
        ✨ AI-Powered Learning Platform
      </div>
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
        Bridge Your <span className="text-indigo-600">Skill </span> <br /> 
        with AI Intelligence
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-slate-500 mb-10">
        Skill-Gap is an AI-powered platform that analyzes user skills, identifies gaps based on career goals, and recommends personalized learning paths.
      </p>
      
      <div className="flex flex-wrap justify-center gap-4">
        {/* Connected "Get Started" to Registration */}
        <Link href="/register">
          <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started →
          </button>
        </Link>

        {/* Connected "Login" to Login Page */}
        <Link href="/login">
          <button className="px-8 py-3 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
            Login
          </button>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="max-w-4xl mx-auto mt-24 grid grid-cols-1 md:grid-cols-3 bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200 border border-slate-300">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-slate-900">10K+</h2>
          <p className="text-slate-400 font-medium">Active Learners</p>
        </div>
        <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-100 py-6 md:py-0">
          <h2 className="text-4xl font-bold text-slate-900">500+</h2>
          <p className="text-slate-400 font-medium">Learning Paths</p>
        </div>
        <div className="space-y-1 py-4 md:py-0">
          <h2 className="text-4xl font-bold text-slate-900">98%</h2>
          <p className="text-slate-400 font-medium">Success Rate</p>
        </div>
      </div>
    </section>
  );
}