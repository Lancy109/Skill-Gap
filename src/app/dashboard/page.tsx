"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Zap, BookOpen, User, 
  TrendingUp, Target, Award, ArrowUpRight, 
  Clock, BrainCircuit, Bell
} from 'lucide-react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // --- Chart Data ---
  const radarData = {
    labels: ['Frontend', 'Backend', 'System Design', 'Cloud', 'Logic', 'DevOps'],
    datasets: [
      {
        label: 'Current Skills',
        data: [85, 40, 30, 20, 90, 15],
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: '#4f46e5',
        borderWidth: 2,
      },
      {
        label: 'Target Role Needs',
        data: [90, 85, 80, 75, 95, 70],
        backgroundColor: 'rgba(226, 232, 240, 0.2)',
        borderColor: '#94a3b8',
        borderWidth: 1,
        borderDash: [5, 5],
      },
    ],
  };

  const lineData = {
    labels: ['Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [{
      label: 'Skill Score',
      data: [45, 52, 61, 68],
      borderColor: '#4f46e5',
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79, 70, 229, 0.05)',
    }]
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-black tracking-tight text-lg">SkillGap</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Dashboard', 'Skills', 'Learning', 'Profile'].map((item) => (
              <button key={item} className={`text-sm font-bold ${item === 'Dashboard' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600 transition-colors'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-100" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Mission Control</h1>
            <p className="text-slate-500 font-medium">Tracking your path to <span className="text-indigo-600">Senior Software Engineer</span></p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            <Zap size={16} className="fill-current text-yellow-400" /> Start Daily Sprint
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. Progress Overview (Bento Box) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Mastery Score</p>
                <Award className="text-indigo-600" size={20} />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h2 className="text-5xl font-black text-slate-900">68</h2>
                <span className="text-slate-400 font-bold">/100</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} className="h-full bg-indigo-600" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Completion: <span className="text-slate-900 font-bold">42% of Roadmap</span></p>
            </div>

            {/* 2. Last Skill Analysis (AI Insight) */}
            <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-200">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit size={20} className="text-indigo-200" />
                <p className="text-xs font-black text-indigo-200 uppercase tracking-widest">AI Analysis</p>
              </div>
              <p className="text-lg font-bold leading-snug mb-4">
                "Your logic scores are elite, but your <span className="bg-white/20 px-1.5 rounded">System Design</span> is creating a bottleneck for Senior roles."
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-bold opacity-60">Last sync: 2h ago</span>
                <button className="text-xs font-black flex items-center gap-1 hover:underline">Full Report <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </div>

          {/* 3. Graph & Visualization */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-8">
                <Target size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-900">Skill Comparison</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Radar data={radarData} options={{ scales: { r: { ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-slate-400" />
                  <h3 className="font-bold text-slate-900">Growth Velocity</h3>
                </div>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg">+12%</span>
              </div>
              <div className="flex-1">
                <Line data={lineData} options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { x: { grid: { display: false } }, y: { display: false } },
                  plugins: { legend: { display: false } }
                }} />
              </div>
            </div>

            {/* Improvised Section: Daily Milestone List */}
            <div className="md:col-span-2 bg-slate-50 border border-slate-100 p-6 rounded-[28px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Priority Gaps to Bridge</h3>
                <Clock size={16} className="text-slate-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { skill: 'Caching Strategies', time: '4h', difficulty: 'Med' },
                  { skill: 'Dockerizing Apps', time: '6h', difficulty: 'High' },
                  { skill: 'PR Reviewing', time: '2h', difficulty: 'Low' },
                ].map((item) => (
                  <div key={item.skill} className="bg-white p-4 rounded-2xl border border-slate-200/50 flex flex-col gap-2 hover:border-indigo-200 transition-colors cursor-pointer">
                    <span className="text-xs font-bold text-slate-900">{item.skill}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Focus: {item.time}</span>
                      <span className="text-[10px] font-black text-indigo-600">{item.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}