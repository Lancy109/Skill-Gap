'use client';

import React from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  summary: string;
}

export default function SummaryModal({ isOpen, onClose, isLoading, summary }: SummaryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
          >
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl pointer-events-auto border border-slate-100 overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">AI Breakdown</h3>
                    <p className="text-xs text-slate-500 font-medium">Powered by Gemini 1.5</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <div>
                      <p className="font-bold text-slate-900">Analyzing Content...</p>
                      <p className="text-sm text-slate-400">Extracting key concepts and insights</p>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm prose-slate max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-600">
                      {summary}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}