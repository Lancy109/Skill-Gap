import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-[100]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:bg-indigo-700 transition-colors">
            <span className="font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            Skill <span className="text-indigo-600">Gap</span>
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            How it works
          </Link>
          <Link href="/#features" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            About
          </Link>
        </div>

        {/* Action Buttons - FIXED OVERLAP HERE */}
        <div className="flex items-center gap-6"> 
          <Link 
            href="/login" 
            className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors whitespace-nowrap"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95 whitespace-nowrap"
          >
            Signup
          </Link>
        </div>

      </div>
    </nav>
  );
}