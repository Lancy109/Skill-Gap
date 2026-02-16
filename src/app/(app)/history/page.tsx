"use client";

import React from 'react';
import { History, Play, Clock, Calendar } from 'lucide-react';

// Mock data for history - in a real app, fetch this based on user ID
const historyItems = [
  {
    id: 1,
    title: "Introduction to Kubernetes",
    skill: "DevOps",
    viewedAt: "2 hours ago",
    progress: 45,
    thumbnail: "bg-blue-100"
  },
  {
    id: 2,
    title: "Advanced React Hooks",
    skill: "Frontend",
    viewedAt: "Yesterday",
    progress: 90,
    thumbnail: "bg-indigo-100" // Corrected color class
  },
  {
    id: 3,
    title: "System Design Interview Prep",
    skill: "Backend",
    viewedAt: "2 days ago",
    progress: 15,
    thumbnail: "bg-green-100"
  },
  {
    id: 4,
    title: "Docker Essentials",
    skill: "DevOps",
    viewedAt: "3 days ago",
    progress: 100, // Completed
    thumbnail: "bg-sky-100"
  }
];

export default function HistoryPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Watch History</h1>
          <p className="text-slate-500">Resume where you left off</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {historyItems.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {historyItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 md:items-center group cursor-pointer">
                {/* Thumbnail Placeholder */}
                <div className={`w-full md:w-48 h-28 rounded-xl ${item.thumbnail} flex items-center justify-center shrink-0 relative overflow-hidden`}>
                  <Play className="text-slate-900/20 group-hover:scale-110 transition-transform duration-300" size={32} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                      {item.skill}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {item.viewedAt}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>

                  {/* Progress Bar */}
                  <div className="max-w-md">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                    {item.progress === 100 ? 'Watch Again' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            No history found. Start watching courses to see them here!
          </div>
        )}
      </div>
    </div>
  );
}