"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Common input class to ensure visibility and consistency
  const inputClasses = "w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex bg-[#fbfcfe]">
      {/* LEFT PANEL: High-Impact Visual */}
      <div className="hidden lg:flex w-[45%] bg-indigo-600 relative overflow-hidden flex-col justify-center px-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400 rounded-full blur-[120px] opacity-50" />
        
        <Link href="/" className="absolute top-12 left-12 flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
             <span className="text-indigo-600 font-black text-xl">S</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">Skill Gap</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-extrabold text-white leading-[1.2] mb-6">
            Unlock Your <br /> 
            <span className="text-indigo-200">AI-Powered</span> <br /> 
            Potential.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md leading-relaxed opacity-90">
            Sign in to continue your personalized learning journey and track your skill growth in real-time.
          </p>
        </motion.div>
      </div>

      {/* RIGHT PANEL: Fixed Layout Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[460px] bg-white p-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-50"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="Your Email Address"
                className={inputClasses}
              />
            </div>

            {/* Password Field - FIXED VISIBILITY */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className={inputClasses}
                />
                
              </div>
            </div>

            <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:translate-y-[-2px] active:scale-95 transition-all">
              Sign In
            </button>
          </form>

          {/* ... rest of the UI (Dividers/Social Buttons) ... */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">or login with</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 transition-all active:scale-95 text-sm">
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 font-bold text-slate-700 transition-all active:scale-95 text-sm">
              Microsoft
            </button>
          </div>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Don't have an account? <Link href="/register" className="text-indigo-600 font-bold hover:underline underline-offset-4">Sign up for free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}