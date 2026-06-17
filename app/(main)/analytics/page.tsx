"use client";

import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-slate-400 mt-1">Deep dive into your cognitive and study trends.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl h-64 flex items-center justify-center">
          <p className="text-slate-400">Study Time Chart Placeholder</p>
        </div>
        <div className="glass-card p-6 rounded-2xl h-64 flex items-center justify-center">
          <p className="text-slate-400">Cognitive Metrics Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
}
