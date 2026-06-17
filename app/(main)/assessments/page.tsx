"use client";

import React from 'react';
import { Button } from '../../components/ui/Button';

export default function AssessmentsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Cognitive Assessment</h1>
        <p className="text-slate-400 mt-1">Measure your memory, focus, and logical reasoning.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
            <span className="text-3xl">🧩</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Full Diagnostic</h2>
          <p className="text-slate-400 mb-6 line-clamp-3">
            A comprehensive 15-minute test covering working memory, pattern recognition, spatial reasoning, and sustained focus. 
            Used to calibrate your baseline cognitive profile.
          </p>
          <Button variant="primary" size="lg" className="w-full">
            Start Full Diagnostic
          </Button>
        </div>

        <div className="space-y-4">
          {['Working Memory', 'Pattern Recognition', 'Spatial Reasoning'].map(type => (
            <div key={type} className="glass-card p-5 rounded-xl flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div>
                <h3 className="font-bold text-white">{type} Test</h3>
                <p className="text-sm text-slate-400">Quick 3-minute check-in</p>
              </div>
              <Button variant="ghost" size="sm">Start</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
