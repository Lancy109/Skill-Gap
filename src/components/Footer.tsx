"use client";
import React from 'react';
import Link from 'next/link';
import { Twitter, Linkedin, Github, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-slate-400 py-12 relative overflow-hidden border-t border-slate-900">
      {/* Subtle background glow for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
                <span className="font-bold text-base">S</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Skill Gap</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Advancing professional potential through precision AI analysis and high-fidelity learning roadmaps.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Minimalist Nav Columns */}
          <div className="md:col-span-2">
            <p className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Platform</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors flex items-center gap-1 group">Analysis <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Roadmaps</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Video Insights</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Company</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Vision</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Press</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="text-white font-semibold mb-4 text-xs uppercase tracking-[0.15em]">Compliance</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Privacy & Terms</Link></li>
              <li className="flex items-center gap-2 text-slate-500 pt-2 border-t border-slate-900">
                <ShieldCheck size={14} className="text-indigo-500" />
                <span className="text-[11px] font-medium uppercase tracking-tighter">Enterprise Secure</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-slate-600 uppercase tracking-widest">
            © 2026 Skill Gap Intelligence Inc.
          </p>
          <div className="flex items-center gap-6">
             <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              Scroll to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}