"use client";

import React from 'react';

export default function ProfilePage() {
  return (
    <div className="animate-fade-in space-y-6 max-w-3xl mx-auto">
      <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 p-1">
            <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-900">
              <span className="text-3xl">👨‍💻</span>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Alex</h1>
            <p className="text-slate-400 text-lg">B.Tech in Computer Science</p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">Data Structures</span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">Calculus</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Level</div>
            <div className="text-2xl font-bold text-white">4</div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Total XP</div>
            <div className="text-2xl font-bold text-indigo-400">2,450</div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
            <div className="text-slate-400 text-sm mb-1">Daily Goal</div>
            <div className="text-2xl font-bold text-teal-400">60 mins</div>
          </div>
        </div>
      </div>
    </div>
  );
}
