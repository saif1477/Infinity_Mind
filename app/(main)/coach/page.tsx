"use client";

import React, { useState } from 'react';

export default function CoachPage() {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <header className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Coach</h1>
        <p className="text-slate-400 mt-1">Your personal tutor powered by Gemma 4.</p>
      </header>

      <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Initial Greeting */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center flex-shrink-0 text-white font-bold">IM</div>
            <div className="glass bg-slate-800/80 p-4 rounded-2xl rounded-tl-sm text-slate-200">
              <p>Hi Alex! How can I help you study today?</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Data Structures or anything else..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-500 transition-colors">
              <span className="text-white text-sm">↑</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
