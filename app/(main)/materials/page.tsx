"use client";

import React from 'react';

export default function MaterialsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Study Materials</h1>
          <p className="text-slate-400 mt-1">Upload PDFs, PPTs, or DOCXs and let AI generate flashcards, summaries, and quizzes.</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all cursor-pointer">
          + Upload Material
        </button>
      </header>

      {/* Empty State Scaffold */}
      <div className="glass-card border-dashed border-2 border-slate-700/50 rounded-2xl flex flex-col items-center justify-center p-16 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-slate-400">📂</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No materials yet</h3>
        <p className="text-slate-400 max-w-md">
          Drag and drop your lecture slides, notes, or textbook chapters here. 
          Infinity Mind will automatically process them for RAG and create study tools.
        </p>
      </div>
    </div>
  );
}
