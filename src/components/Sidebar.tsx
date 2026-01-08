import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Skill Analysis', href: '/skill-input', icon: '🎯' },
    { name: 'Recommendations', href: '/recommendations', icon: '💡' },
    { name: 'Video Summaries', href: '/video-summary', icon: '🎥' },
    { name: 'Settings', href: '/setting', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 p-6 flex flex-col fixed left-0 top-0">
      <div className="text-2xl font-bold text-indigo-600 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div> Skill Gap
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all font-medium">
            <span>{item.icon}</span> {item.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 bg-slate-50 rounded-2xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pro Plan</p>
        <p className="text-sm text-slate-600 mb-3">Get unlimited AI summaries</p>
        <button className="w-full py-2 bg-indigo-600 text-white text-xs rounded-lg font-bold">Upgrade</button>
      </div>
    </aside>
  );
}