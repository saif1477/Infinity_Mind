"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Study Materials', href: '/materials', icon: '📚' },
  { label: 'Assessments', href: '/assessments', icon: '🧠' },
  { label: 'AI Coach', href: '/coach', icon: '🤖' },
  { label: 'Brain Training', href: '/training', icon: '🎮' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r border-slate-800 flex flex-col pt-4 pb-6 z-20">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center">
          <span className="font-bold text-xs text-white">IM</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-white">Infinity Mind</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive 
                  ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-[inset_2px_0_0_#6366f1]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all">
          <span className="text-xl">⚙️</span>
          Settings
        </Link>
      </div>
    </aside>
  );
};
