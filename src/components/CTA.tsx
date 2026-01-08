import React from 'react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-[#5046e5] to-[#9333ea] rounded-[40px] p-16 text-center text-white relative overflow-hidden shadow-2xl">
        <h2 className="text-4xl font-bold mb-6">Ready to Bridge Your Skill Gap?</h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto opacity-90">
          Join thousands of professionals who are already accelerating their careers with AI-powered learning.
        </p>
        
        {/* Connected Button */}
        <Link href="/register">
          <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-black/10">
            Get Started Free →
          </button>
        </Link>
        
        <p className="mt-8 text-xs text-indigo-200 font-medium">No credit card required • Start learning in minutes</p>
      </div>
    </section>
  );
}