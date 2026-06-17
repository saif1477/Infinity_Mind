"use client";

import React from 'react';

export default function BrainTrainingPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Brain Training</h1>
        <p className="text-slate-400 mt-1">Daily mini-games to improve working memory and processing speed.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* N-Back Game */}
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/20 group hover:border-indigo-500/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🧠</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Dual N-Back</h3>
          <p className="text-sm text-slate-400 mb-4">Improve your working memory and fluid intelligence.</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Level 3</span>
            <span className="text-sm font-bold text-white">Play →</span>
          </div>
        </div>

        {/* Stroop Test */}
        <div className="glass-card p-6 rounded-2xl border border-teal-500/20 group hover:border-teal-500/50 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Stroop Speed</h3>
          <p className="text-sm text-slate-400 mb-4">Enhance cognitive flexibility and processing speed.</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-1 rounded">Level 1</span>
            <span className="text-sm font-bold text-white">Play →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
