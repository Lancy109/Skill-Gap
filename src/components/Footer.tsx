"use client";
import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
        
        {/* Simple Brand Mark */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px] font-bold">
            S
          </div>
          <span className="font-bold text-white text-sm tracking-tight">SkillGap</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-8">
          <a href="#" className="hover:text-indigo-400 transition-colors"><Twitter size={18} /></a>
          <a href="#" className="hover:text-indigo-400 transition-colors"><Linkedin size={18} /></a>
          <a href="#" className="hover:text-indigo-400 transition-colors"><Github size={18} /></a>
        </div>

        {/* Minimal Copyright */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          © {currentYear} SkillGap Intelligence
        </p>
        
      </div>
    </footer>
  );
}