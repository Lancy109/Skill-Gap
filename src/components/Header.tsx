import React from 'react';
import Link from 'next/link';

export default function Navbar({ isLoggedIn = false }) {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
          Skill Gap
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
          <Link href="/#features" className="hover:text-indigo-600 transition">Features</Link>
          <Link href="/#how-it-works" className="hover:text-indigo-600 transition">How it Works</Link>
          {isLoggedIn && <Link href="/dashboard" className="hover:text-indigo-600 transition">Dashboard</Link>}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-slate-600 font-semibold hover:text-indigo-600 transition">Login</Link>
              <Link href="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Hi, User</span>
              <div className="w-10 h-10 bg-indigo-100 rounded-full border border-indigo-200"></div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}