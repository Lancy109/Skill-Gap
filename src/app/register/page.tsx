"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  // Common input style to ensure text is visible and consistent
  const inputStyle = "w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#fbfcfe] flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            <span className="text-white font-black text-xl">S</span>
          </div>
          <span className="text-2xl font-black text-slate-900">Skill Gap</span>
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
        <p className="text-slate-500 font-medium mt-2">Join 10,000+ learners bridging their skill gaps today.</p>
      </div>

      <motion.div 
        layout className="w-full max-w-xl bg-white p-10 md:p-14 rounded-[48px] shadow-2xl shadow-indigo-100/50 border border-slate-50 relative overflow-hidden"
      >
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= num ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                {num}
              </div>
              {num < 3 && <div className={`h-1 w-12 rounded-full ${step > num ? 'bg-indigo-600' : 'bg-slate-100'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                  <input type="text" placeholder="John" className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                  <input type="text" placeholder="Doe" className={inputStyle} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className={inputStyle} />
              </div>
              <button onClick={() => setStep(2)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Next: Account Security</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className={inputStyle} 
                  />
                  
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <input type="password" placeholder="••••••••" className={inputStyle} />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Account</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
              <p className="text-slate-500 mb-8">Redirecting you to complete your skill profile...</p>
              <Link href="/skill-input" className="inline-block px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                Continue to Skill Input →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="mt-10 text-slate-500 font-medium">
        Already have an account? <Link href="/login" className="text-indigo-600 font-bold hover:underline underline-offset-4">Sign in here</Link>
      </p>
    </div>
  );
}